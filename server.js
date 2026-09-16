import { createServer } from 'node:http'
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import nodemailer from 'nodemailer'

const root = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(root, 'data')
const dataFile = path.join(dataDir, 'db.json')
const port = Number(process.env.PORT || 3001)
const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase()
const adminPassword = process.env.ADMIN_PASSWORD
const smtpTransport = process.env.SMTP_HOST ? nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: process.env.SMTP_SECURE === 'true', auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } }) : null
const otpFrom = process.env.OTP_FROM || process.env.SMTP_USER

const seedProducts = [
  { name: 'Galaxy S23 Ultra', category: 'Phones', price: 680000, condition: 'Like new', location: 'Kigali', seller: 'Verified seller', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=80', description: 'A premium smartphone with a bright display, excellent camera system and all-day battery.', status: 'market', ratings: [] },
  { name: 'MacBook Air M2', category: 'Laptops', price: 1250000, condition: 'Good', location: 'Kigali', seller: 'Verified seller', image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=900&q=80', description: 'Lightweight laptop for creative work, study and everyday productivity.', status: 'market', ratings: [] },
  { name: 'Sony WH-1000XM5', category: 'Audio', price: 310000, condition: 'New', location: 'Huye', seller: 'Verified seller', image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80', description: 'Comfortable wireless headphones with rich sound and noise cancellation.', status: 'market', ratings: [] },
]

function ensureDatabase() {
  mkdirSync(dataDir, { recursive: true })
  if (!existsSync(dataFile)) writeFileSync(dataFile, JSON.stringify({ users: [], products: seedProducts.map((product, index) => ({ ...product, id: index + 1, sellerId: null })), orders: [], repairs: [], events: [], otpChallenges: [] }, null, 2))
}
function readDb() { ensureDatabase(); const db = JSON.parse(readFileSync(dataFile, 'utf8')); db.products = (db.products || []).map((product) => ({ ...product, status: product.status || 'market', ratings: product.ratings || [] })); db.otpChallenges = db.otpChallenges || []; return db }
function writeDb(db) { writeFileSync(dataFile, JSON.stringify(db, null, 2)) }
function send(response, status, body) { response.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, Authorization', 'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS' }); response.end(JSON.stringify(body)) }
function id() { return `${Date.now()}-${randomBytes(4).toString('hex')}` }
function hashPassword(password, salt = randomBytes(16).toString('hex')) { return `${salt}:${scryptSync(password, salt, 64).toString('hex')}` }
function passwordMatches(password, stored) { const [salt, hash] = stored.split(':'); const actual = scryptSync(password, salt, 64); return timingSafeEqual(actual, Buffer.from(hash, 'hex')) }
async function body(request) { let raw = ''; for await (const chunk of request) raw += chunk; return raw ? JSON.parse(raw) : {} }
function auth(request, db) { const token = request.headers.authorization?.replace('Bearer ', ''); return db.users.find((user) => user.token === token) || null }
function publicUser(user) { return { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role || 'user', trustStatus: user.trustStatus || 'unreviewed' } }
function adminOnly(user) { return user?.role === 'admin' }
function validImage(image) { return !image || (/^data:image\/(jpeg|jpg|png|webp);base64,/.test(image) && image.length <= 5 * 1024 * 1024) }
function averageRating(product) { return product.ratings?.length ? Number((product.ratings.reduce((sum, rating) => sum + rating.score, 0) / product.ratings.length).toFixed(1)) : 0 }
async function sendOtpEmail(email, otp) { if (!smtpTransport || !otpFrom) return false; await smtpTransport.sendMail({ from: otpFrom, to: email, subject: 'Your gura&ugurisha verification code', text: `Your verification code is ${otp}. It expires in 10 minutes.` }); return true }

const server = createServer(async (request, response) => {
  if (request.method === 'OPTIONS') return send(response, 204, {})
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`)
  const db = readDb()
  try {
    if (request.method === 'GET' && url.pathname === '/api/health') return send(response, 200, { ok: true, service: 'gura-ugurisha-api' })
    if (request.method === 'GET' && url.pathname === '/api/products') {
      const query = (url.searchParams.get('q') || '').toLowerCase()
      const category = url.searchParams.get('category')
      const products = db.products.filter((product) => product.status !== 'sold' && (!query || `${product.name} ${product.category} ${product.location}`.toLowerCase().includes(query)) && (!category || category === 'All' || product.category === category)).map((product) => ({ ...product, rating: averageRating(product), ratingCount: product.ratings.length }))
      return send(response, 200, { products })
    }
    if (request.method === 'POST' && url.pathname === '/api/auth/register/start') {
      const input = await body(request)
      const email = input.email?.toLowerCase()
      if (!input.name || !email || !input.password) return send(response, 400, { error: 'Name, email, and password are required.' })
      if (db.users.some((candidate) => candidate.email === email) || db.otpChallenges.some((challenge) => challenge.email === email && Date.parse(challenge.expiresAt) > Date.now())) return send(response, 409, { error: 'An account or active verification already exists for that email.' })
      const otp = String(Math.floor(100000 + Math.random() * 900000))
      db.otpChallenges = db.otpChallenges.filter((challenge) => challenge.email !== email)
      db.otpChallenges.push({ id: id(), email, name: input.name, phone: input.phone || '', password: hashPassword(input.password), otpHash: hashPassword(otp), expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString() })
      try { const delivered = await sendOtpEmail(email, otp); writeDb(db); return send(response, delivered ? 202 : 202, { message: 'Verification code sent.', ...(process.env.NODE_ENV !== 'production' && !delivered ? { developmentOtp: otp } : {}) }) } catch { return send(response, 502, { error: 'Could not send the verification email.' }) }
    }
    if (request.method === 'POST' && url.pathname === '/api/auth/register/verify') {
      const input = await body(request)
      const challenge = db.otpChallenges.find((candidate) => candidate.email === input.email?.toLowerCase())
      if (!challenge || Date.parse(challenge.expiresAt) < Date.now() || !input.otp || !passwordMatches(input.otp, challenge.otpHash)) return send(response, 400, { error: 'Invalid or expired verification code.' })
      const user = { id: id(), name: challenge.name, email: challenge.email, phone: challenge.phone, password: challenge.password, token: id(), role: 'user', trustStatus: 'unreviewed', createdAt: new Date().toISOString() }
      db.users.push(user); db.otpChallenges = db.otpChallenges.filter((candidate) => candidate.id !== challenge.id); writeDb(db)
      return send(response, 201, { user: publicUser(user), token: user.token })
    }
    if (request.method === 'POST' && url.pathname === '/api/auth/register') {
      const input = await body(request)
      return send(response, 410, { error: 'Registration now requires email verification. Use /api/auth/register/start, then /api/auth/register/verify.' })
    }
    if (request.method === 'POST' && url.pathname === '/api/auth/login') {
      const input = await body(request)
      if (adminEmail && adminPassword && input.email?.toLowerCase() === adminEmail && input.password === adminPassword) {
        let admin = db.users.find((candidate) => candidate.email === adminEmail)
        if (!admin) { admin = { id: id(), name: 'Administrator', email: adminEmail, phone: '', password: hashPassword(adminPassword), token: id(), role: 'admin', createdAt: new Date().toISOString() }; db.users.push(admin); writeDb(db) }
        else if (admin.role !== 'admin') { admin.role = 'admin'; admin.token = id(); writeDb(db) }
        return send(response, 200, { user: publicUser(admin), token: admin.token })
      }
      const user = db.users.find((candidate) => candidate.email === input.email?.toLowerCase())
      if (!user || !input.password || !passwordMatches(input.password, user.password)) return send(response, 401, { error: 'Invalid email or password.' })
      return send(response, 200, { user: publicUser(user), token: user.token })
    }
    const user = auth(request, db)
    if (request.method === 'POST' && url.pathname === '/api/analytics/events') {
      const input = await body(request)
      if (!input.event || !input.page) return send(response, 400, { error: 'Event and page are required.' })
      db.events = db.events || []
      db.events.push({ id: id(), event: input.event, page: input.page, sessionId: input.sessionId || null, createdAt: new Date().toISOString() })
      if (db.events.length > 10000) db.events = db.events.slice(-10000)
      writeDb(db)
      return send(response, 202, { accepted: true })
    }
    if (request.method === 'GET' && url.pathname === '/api/admin/overview') {
      if (!adminOnly(user)) return send(response, user ? 403 : 401, { error: 'Administrator access required.' })
      const events = db.events || []
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
      const recentEvents = events.filter((event) => Date.parse(event.createdAt) >= sevenDaysAgo)
      const pageViews = recentEvents.filter((event) => event.event === 'page_view')
      const pages = pageViews.reduce((counts, event) => { counts[event.page] = (counts[event.page] || 0) + 1; return counts }, {})
      return send(response, 200, {
        metrics: { users: db.users.filter((candidate) => candidate.role !== 'admin').length, products: db.products.length, orders: db.orders.length, repairs: db.repairs.length, pageViews7d: pageViews.length, activeSessions7d: new Set(recentEvents.map((event) => event.sessionId).filter(Boolean)).size },
        popularPages: Object.entries(pages).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([page, views]) => ({ page, views })),
        recentUsers: db.users.filter((candidate) => candidate.role !== 'admin').slice(-8).reverse().map(publicUser),
        products: db.products.map((product) => ({ id: product.id, name: product.name, seller: product.seller, sellerId: product.sellerId, price: product.price, category: product.category, status: product.status, rating: averageRating(product), ratingCount: product.ratings.length })),
        recentOrders: db.orders.slice(-8).reverse().map((order) => ({ id: order.id, status: order.status, location: order.location, createdAt: order.createdAt })),
      })
    }
    if (request.method === 'DELETE' && url.pathname.startsWith('/api/admin/products/')) {
      if (!adminOnly(user)) return send(response, user ? 403 : 401, { error: 'Administrator access required.' })
      const productId = url.pathname.split('/').pop()
      const productIndex = db.products.findIndex((product) => String(product.id) === productId)
      if (productIndex === -1) return send(response, 404, { error: 'Product not found.' })
      const [product] = db.products.splice(productIndex, 1)
      writeDb(db)
      return send(response, 200, { deleted: product.id })
    }
    if (request.method === 'PATCH' && url.pathname.startsWith('/api/admin/users/')) {
      if (!adminOnly(user)) return send(response, user ? 403 : 401, { error: 'Administrator access required.' })
      const targetId = url.pathname.split('/').pop()
      const target = db.users.find((candidate) => String(candidate.id) === targetId && candidate.role !== 'admin')
      const input = await body(request)
      if (!target) return send(response, 404, { error: 'User not found.' })
      if (!['legit', 'scam', 'unreviewed'].includes(input.trustStatus)) return send(response, 400, { error: 'Trust status must be legit, scam, or unreviewed.' })
      target.trustStatus = input.trustStatus
      target.reviewedAt = new Date().toISOString()
      target.reviewedBy = user.id
      writeDb(db)
      return send(response, 200, { user: publicUser(target) })
    }
    if (request.method === 'PATCH' && url.pathname.startsWith('/api/products/') && url.pathname.endsWith('/status')) {
      if (!user) return send(response, 401, { error: 'Authentication required.' })
      const productId = url.pathname.split('/')[3]
      const product = db.products.find((candidate) => String(candidate.id) === productId)
      const input = await body(request)
      if (!product) return send(response, 404, { error: 'Product not found.' })
      if (user.role !== 'admin' && product.sellerId !== user.id) return send(response, 403, { error: 'Only the seller or an administrator can update this product.' })
      if (!['market', 'sold'].includes(input.status)) return send(response, 400, { error: 'Status must be market or sold.' })
      product.status = input.status; product.updatedAt = new Date().toISOString(); writeDb(db); return send(response, 200, { product })
    }
    if (request.method === 'POST' && url.pathname.startsWith('/api/products/') && url.pathname.endsWith('/ratings')) {
      if (!user) return send(response, 401, { error: 'Authentication required.' })
      const productId = url.pathname.split('/')[3]
      const product = db.products.find((candidate) => String(candidate.id) === productId)
      const input = await body(request)
      if (!product) return send(response, 404, { error: 'Product not found.' })
      if (!Number.isInteger(input.score) || input.score < 1 || input.score > 5) return send(response, 400, { error: 'Rating must be a whole number from 1 to 5.' })
      product.ratings = product.ratings.filter((rating) => rating.userId !== user.id); product.ratings.push({ userId: user.id, score: input.score, comment: String(input.comment || '').slice(0, 300), createdAt: new Date().toISOString() }); writeDb(db)
      return send(response, 201, { rating: input.score, ratingCount: product.ratings.length, averageRating: averageRating(product) })
    }
    if (request.method === 'GET' && url.pathname === '/api/me') return user ? send(response, 200, { user: publicUser(user) }) : send(response, 401, { error: 'Authentication required.' })
    if (request.method === 'POST' && url.pathname === '/api/products') {
      if (!user) return send(response, 401, { error: 'Authentication required.' })
      const input = await body(request)
      if (!input.name || !input.category || !input.price || !input.description) return send(response, 400, { error: 'Name, category, price, and description are required.' })
      if (!validImage(input.image)) return send(response, 400, { error: 'Upload a JPG, PNG, or WEBP image smaller than 5 MB.' })
      const product = { ...input, id: id(), price: Number(input.price), seller: user.name, sellerId: user.id, image: input.image || '', condition: input.condition || 'Good', location: input.location || 'Kigali', status: 'market', ratings: [] }
      db.products.unshift(product); writeDb(db); return send(response, 201, { product })
    }
    if (request.method === 'POST' && url.pathname === '/api/orders') {
      if (!user) return send(response, 401, { error: 'Authentication required.' })
      const input = await body(request)
      if (!Array.isArray(input.items) || !input.items.length || !input.name || !input.phone || !input.location) return send(response, 400, { error: 'Items, name, phone, and delivery location are required.' })
      const order = { id: id(), userId: user.id, items: input.items, name: input.name, phone: input.phone, location: input.location, status: 'pending', createdAt: new Date().toISOString() }
      db.orders.push(order); writeDb(db); return send(response, 201, { order })
    }
    if (request.method === 'POST' && url.pathname === '/api/repairs') {
      const input = await body(request)
      if (!input.device || !input.brand || !input.issue || !input.location) return send(response, 400, { error: 'Device, brand, issue, and location are required.' })
      const repair = { id: id(), userId: user?.id || null, ...input, status: 'received', createdAt: new Date().toISOString() }
      db.repairs.push(repair); writeDb(db); return send(response, 201, { repair })
    }
    return send(response, 404, { error: 'Route not found.' })
  } catch (error) {
    console.error(error)
    return send(response, 500, { error: 'Unexpected server error.' })
  }
})

server.listen(port, () => console.log(`gura&ugurisha API listening on http://localhost:${port}`))