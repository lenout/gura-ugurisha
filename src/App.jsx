import { useEffect, useMemo, useState } from "react";

const catalogProducts = [];
/*
  {
    id: 1,
    name: "Galaxy S23 Ultra",
    category: "Phones",
    price: 680000,
    condition: "Like new",
    location: "Kigali",
    seller: "Verified seller",
    image:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=80",
    description:
      "A premium smartphone with a bright display, excellent camera system and all-day battery.",
  },
  {
    id: 2,
    name: "MacBook Air M2",
    category: "Laptops",
    price: 1250000,
    condition: "Good",
    location: "Kigali",
    seller: "Verified seller",
    image:
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=900&q=80",
    description:
      "Lightweight laptop for creative work, study and everyday productivity.",
  },
  {
    id: 3,
    name: "Sony WH-1000XM5",
    category: "Audio",
    price: 310000,
    condition: "New",
    location: "Huye",
    seller: "Verified seller",
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80",
    description:
      "Comfortable wireless headphones with rich sound and noise cancellation.",
  },
  {
    id: 4,
    name: "Canon EOS M50",
    category: "Cameras",
    price: 590000,
    condition: "Good",
    location: "Kigali",
    seller: "Verified seller",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80",
    description:
      "A versatile mirrorless camera ready for photos, video and content creation.",
  },
  {
    id: 5,
    name: "Nintendo Switch OLED",
    category: "Gaming",
    price: 480000,
    condition: "Like new",
    location: "Musanze",
    seller: "Verified seller",
    image:
      "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=900&q=80",
    description:
      "A portable and living-room gaming console with a vivid OLED display.",
  },
  {
    id: 6,
    name: "Samsung 55” Smart TV",
    category: "TVs",
    price: 720000,
    condition: "New",
    location: "Kigali",
    seller: "Verified seller",
    image:
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=900&q=80",
    description:
      "Bring streaming, sports and films to life with a crisp smart television.",
  },
  {
    id: 7,
    name: "iPad Air 5th Gen",
    category: "Tablets",
    price: 735000,
    condition: "Like new",
    location: "Kigali",
    seller: "Verified seller",
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=80",
    description:
      "A powerful, portable tablet for notes, study, design and entertainment.",
  },
  {
    id: 8,
    name: "JBL Flip 6 Speaker",
    category: "Audio",
    price: 165000,
    condition: "New",
    location: "Rubavu",
    seller: "Verified seller",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80",
    description:
      "Portable waterproof sound with a bold bass response and long battery life.",
  },
  {
    id: 9,
    name: "Apple Watch Series 8",
    category: "Accessories",
    price: 390000,
    condition: "Good",
    location: "Kigali",
    seller: "Verified seller",
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80",
    description:
      "A smart everyday companion for activity, notifications and health tracking.",
  },
  {
    id: 10,
    name: "Dell XPS 13",
    category: "Laptops",
    price: 980000,
    condition: "Good",
    location: "Huye",
    seller: "Verified seller",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
    description:
      "A compact Windows laptop with a clean display and comfortable keyboard.",
  },
]; */
const categories = [
  "All",
  "Phones",
  "Laptops",
  "Tablets",
  "TVs",
  "Cameras",
  "Audio",
  "Gaming",
  "Accessories",
];
const money = (value) => `RWF ${value.toLocaleString("en-US")}`;
const ui = {
  home: ["Home", "Ahabanza"],
  marketplace: ["Marketplace", "Isoko"],
  categories: ["Categories", "Ibyiciro"],
  sell: ["Sell a product", "Gurisha igikoresho"],
  account: ["Account", "Konti"],
  cart: ["Cart", "Igitebo"],
  search: ["Search electronics", "Shakisha ibikoresho"],
  heroKicker: [
    "RWANDA'S ELECTRONICS MARKETPLACE",
    "ISOKO RYIBIKORESHO BYIKORANABUHANGA MU RWANDA",
  ],
  heroTitle: ["Good tech.", "Ikoranabuhanga ryiza."],
  heroTitle2: ["Better finds.", "Hitamo neza."],
  heroCopy: [
    "Discover electronics from sellers across Rwanda, or list your own products and reach more buyers.",
    "Shakisha ibikoresho byikoranabuhanga ku bacuruzi bo mu Rwanda, cyangwa ushyire ku isoko ibyawe ubone ababigura.",
  ],
  shop: ["Shop electronics", "Gura ibikoresho"],
  sellShort: ["Sell a product", "Gurisha igikoresho"],
  made: ["Made for Rwanda", "Byakorewe u Rwanda"],
  simple: ["Simple, local, trustworthy", "Byoroshye, hafi kandi byizewe"],
  fresh: ["Fresh from the marketplace", "Ibikoresho bishya ku isoko"],
  viewAll: ["View all products", "Reba ibicuruzwa byose"],
  shopType: ["What are you looking for?", "Urashaka iki?"],
};
const tr = (language, key) => ui[key]?.[language === "rw" ? 1 : 0] || key;

function Icon({ children }) {
  return (
    <span className="icon" aria-hidden="true">
      {children}
    </span>
  );
}
function Logo({ onClick }) {
  return (
    <button className="logo" onClick={onClick}>
      <span className="logo-mark">g</span>
      <span>
        gura<span>&</span>ugurisha
      </span>
    </button>
  );
}
function WhatsAppFloat() {
  return <a className="whatsapp-float" href="https://wa.me/250798736364" target="_blank" rel="noreferrer" aria-label="Chat with us on WhatsApp" title="Chat with us on WhatsApp">☏</a>;
}
function Header({
  page,
  go,
  cartCount,
  query,
  setQuery,
  language,
  setLanguage,
  user,
  logout,
}) {
  const [menu, setMenu] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  return (
    <header className="topbar">
      <div className="nav-wrap">
        <Logo onClick={() => go("home")} />
        <nav className={menu ? "nav-links open" : "nav-links"}>
          <button
            className={page === "home" ? "active" : ""}
            onClick={() => {
              go("home");
              setMenu(false);
            }}
          >
            {tr(language, "home")}
          </button>
          <button
            className={page === "shop" ? "active" : ""}
            onClick={() => {
              go("shop");
              setMenu(false);
            }}
          >
            {tr(language, "marketplace")}
          </button>
          <button
            onClick={() => {
              go("shop");
              setMenu(false);
            }}
          >
            {tr(language, "categories")}
          </button>
          <button
            className={page === "sell" ? "active" : ""}
            onClick={() => {
              go("sell");
              setMenu(false);
            }}
          >
            {tr(language, "sell")}
          </button>
        </nav>
        <div className="nav-actions">
          <label className="nav-search">
            <Icon>⌕</Icon>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => go("shop")}
              placeholder={tr(language, "search")}
              aria-label={tr(language, "search")}
            />
          </label>
          <button
            className="language-toggle"
            onClick={() => setLanguage(language === "en" ? "rw" : "en")}
            aria-label="Change language"
          >
            {language === "en" ? "RW" : "EN"}
          </button>
          <button className={`account-btn ${accountOpen ? "active" : ""}`} onClick={() => setAccountOpen(!accountOpen)}>
            <Icon>◯</Icon>
            <span>{tr(language, "account")}</span>
          </button>
          {accountOpen && <div className="account-menu"><b>{user?.name || "Your account"}</b>{user ? <><button onClick={() => { go(user.role === "admin" ? "admin" : "dashboard"); setAccountOpen(false); }}>Dashboard</button><button onClick={() => { logout(); setAccountOpen(false); }}>Log out</button></> : <><button onClick={() => { go("login"); setAccountOpen(false); }}>Log in</button><button onClick={() => { go("register"); setAccountOpen(false); }}>Create account</button></>}</div>}
          <button className="cart-btn" onClick={() => go("cart")}>
            <Icon>▱</Icon>
            <span>{tr(language, "cart")}</span>
            {cartCount > 0 && <b>{cartCount}</b>}
          </button>
        </div>
        <button
          className="menu-btn"
          onClick={() => setMenu(!menu)}
          aria-label="Open menu"
        >
          ☰
        </button>
      </div>
    </header>
  );
}
function Footer({ go }) {
  return (
    <footer>
      <div className="footer-inner">
        <div>
          <Logo onClick={() => go("home")} />
          <p className="footer-copy">
            A considered marketplace for buying and selling electronics in
            Rwanda.
          </p>
        </div>
        <div>
          <h4>Marketplace</h4>
          <button onClick={() => go("shop")}>Browse products</button>
          <button onClick={() => go("sell")}>Sell a product</button>
        </div>
        <div>
          <h4>Account</h4>
          <button onClick={() => go("login")}>Log in</button>
          <button onClick={() => go("register")}>Create account</button>
          <button onClick={() => go("dashboard")}>Dashboard</button>
        </div>
        <div>
          <h4>Contact</h4>
          <a href="mailto:lenout175@gmail.com">lenout175@gmail.com</a>
          <a href="https://wa.me/250798736364" target="_blank" rel="noreferrer">WhatsApp: +250 798 736 364</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 gura&ugurisha</span>
        <span>Buy and sell electronics across Rwanda</span>
      </div>
    </footer>
  );
}
function ProductCard({ product, add, open }) {
  return (
    <article className="product-card">
      <button className="image-button" onClick={() => open(product)}>
        <img src={product.image} alt={`${product.name} electronics product`} />
        <span className="condition">{product.condition}</span>
      </button>
      <div className="product-info">
        <div className="eyebrow">
          {product.category} · {product.location}
        </div>
        <button className="product-name" onClick={() => open(product)}>
          {product.name}
        </button>
        <p className="seller">Listed by {product.seller}</p>
        <div className="card-bottom">
          <strong>{money(product.price)}</strong>
          <button
            className="small-add"
            onClick={() => add(product)}
            aria-label={`Add ${product.name} to cart`}
          >
            +
          </button>
        </div>
      </div>
    </article>
  );
}
function ProductGrid({ products, add, open }) {
  if (!products.length)
    return (
      <div className="empty-state">
        <span className="empty-icon">⌕</span>
        <h3>No products found</h3>
        <p>Try a different search or remove one of the filters.</p>
      </div>
    );
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} add={add} open={open} />
      ))}
    </div>
  );
}
function Home({ go, add, open, language }) {
  return (
    <>
      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="kicker">{tr(language, "heroKicker")}</span>
            <h1>
              {tr(language, "heroTitle")}
              <br />
              <em>{tr(language, "heroTitle2")}</em>
            </h1>
            <p>{tr(language, "heroCopy")}</p>
            <div className="hero-actions">
              <button className="button primary" onClick={() => go("shop")}>
                {tr(language, "shop")} <span>↗</span>
              </button>
              <button className="button text-button" onClick={() => go("sell")}>
                {tr(language, "sellShort")} <span>↗</span>
              </button>
            </div>
            <div className="proof">
              <span className="proof-avatars">●●●</span>
              <span>
                <b>{tr(language, "made")}</b>
                <br />
                <small>{tr(language, "simple")}</small>
              </span>
            </div>
          </div>
          <div className="hero-art">
            <div className="art-tag">
              CURATED FINDS <span>✦</span>
            </div>
            <img
              src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=85"
              alt="Modern electronics arranged on a desk"
            />
            <div className="art-note">
              <span>01</span>
              <b>Find your next favorite device.</b>
            </div>
          </div>
        </section>
        <section className="section featured">
          <div className="section-heading">
            <div>
              <span className="kicker">JUST IN</span>
              <h2>{tr(language, "fresh")}</h2>
            </div>
            <button className="underlined" onClick={() => go("shop")}>
              {tr(language, "viewAll")} <span>↗</span>
            </button>
          </div>
          <ProductGrid
            products={catalogProducts.slice(0, 3)}
            add={add}
            open={open}
          />
        </section>
        <section className="category-band">
          <div className="section-heading">
            <div>
              <span className="kicker">SHOP BY TYPE</span>
              <h2>{tr(language, "shopType")}</h2>
            </div>
          </div>
          <div className="category-row">
            {["Phones", "Laptops", "Audio", "Gaming"].map((category, i) => (
              <button key={category} onClick={() => go("shop", category)}>
                <span className={`cat-icon cat-${i}`}>
                  {["▣", "▤", "◒", "◈"][i]}
                </span>
                <b>{category}</b>
                <span>↗</span>
              </button>
            ))}
          </div>
        </section>
        <section className="trust">
          <div>
            <span className="kicker">A BETTER WAY TO TRADE</span>
            <h2>
              Technology should
              <br />
              <em>move you forward.</em>
            </h2>
          </div>
          <div className="trust-items">
            <div>
              <b>01 / Curated</b>
              <p>Useful electronics, clearly presented and easy to compare.</p>
            </div>
            <div>
              <b>02 / Local</b>
              <p>Connect with buyers and sellers across Rwanda.</p>
            </div>
            <div>
              <b>03 / Simple</b>
              <p>A focused experience without the usual marketplace noise.</p>
            </div>
          </div>
        </section>
        <section className="sell-banner">
          <div>
            <span className="kicker">HAVE TECH TO MOVE ON?</span>
            <h2>
              Turn your unused
              <br />
              tech into opportunity.
            </h2>
          </div>
          <button className="button light" onClick={() => go("sell")}>
            {tr(language, "sellShort")} <span>↗</span>
          </button>
        </section>
      </main>
      <Footer go={go} />
    </>
  );
}
function Filters({
  category,
  setCategory,
  condition,
  setCondition,
  sort,
  setSort,
}) {
  return (
    <div className="filters">
      <div className="filter-label">
        FILTERS <span>↓</span>
      </div>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        aria-label="Filter by category"
      >
        {categories.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
      <select
        value={condition}
        onChange={(e) => setCondition(e.target.value)}
        aria-label="Filter by condition"
      >
        <option>Any condition</option>
        <option>New</option>
        <option>Like new</option>
        <option>Good</option>
      </select>
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        aria-label="Sort products"
      >
        <option value="newest">Newest first</option>
        <option value="low">Price: low to high</option>
        <option value="high">Price: high to low</option>
      </select>
    </div>
  );
}
function Shop({ query, setQuery, add, open, initialCategory, language }) {
  const [category, setCategory] = useState(initialCategory || "All");
  const [condition, setCondition] = useState("Any condition");
  const [sort, setSort] = useState("newest");
  const [inventory, setInventory] = useState(catalogProducts);
  useEffect(() => { fetch("http://localhost:3001/api/products").then((response) => response.json()).then((result) => { if (result.products) setInventory(result.products); }).catch(() => {}); }, []);
  const filteredProducts = useMemo(() => {
    let result = inventory.filter(
      (p) =>
        `${p.name} ${p.category} ${p.location}`
          .toLowerCase()
          .includes(query.toLowerCase()) &&
        (category === "All" || p.category === category) &&
        (condition === "Any condition" || p.condition === condition),
    );
    if (sort === "low") result.sort((a, b) => a.price - b.price);
    if (sort === "high") result.sort((a, b) => b.price - a.price);
    return result;
  }, [query, category, condition, sort, inventory]);
  return (
    <main className="shop-page">
      <div className="page-intro">
        <span className="kicker">THE MARKETPLACE</span>
        <h1>
          {language === "rw" ? (
            <>
              Shaka <br />
              <em>igikoresho ukunda.</em>
            </>
          ) : (
            <>
              Find your next
              <br />
              <em>favorite device.</em>
            </>
          )}
        </h1>
        <p>
          {language === "rw"
            ? "Reba ibikoresho byiza bitangwa n’abacuruzi bo mu Rwanda."
            : "Browse quality electronics from sellers across Rwanda."}
        </p>
      </div>
      <div className="shop-toolbar">
        <div className="wide-search">
          <Icon>⌕</Icon>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              language === "rw"
                ? "Shakisha izina, icyiciro cyangwa aho giherereye"
                : "Search by product, category or location"
            }
            aria-label="Search products"
          />
        </div>
        <Filters
          {...{ category, setCategory, condition, setCondition, sort, setSort }}
        />
      </div>
      <div className="results-line">
        <span>
          {filteredProducts.length} {language === "rw" ? "ibicuruzwa" : "products"}
        </span>
        <span className="inventory-note">Local sellers · Trusted finds</span>
      </div>
      <ProductGrid products={filteredProducts} add={add} open={open} />
    </main>
  );
}
function Detail({ product, add, go, token }) {
  const [score, setScore] = useState(0);
  const [ratingMessage, setRatingMessage] = useState("");
  const rateProduct = async (value) => {
    setScore(value);
    if (!token) return setRatingMessage("Log in to rate this product.");
    const response = await fetch(`http://localhost:3001/api/products/${product.id}/ratings`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ score: value }) });
    const result = await response.json();
    setRatingMessage(response.ok ? `Rated ${result.averageRating}/5 from ${result.ratingCount} rating${result.ratingCount === 1 ? "" : "s"}.` : result.error);
  };
  return (
    <main className="detail-page">
      <button className="back-link" onClick={() => go("shop")}>
        ← Back to marketplace
      </button>
      <div className="detail-layout">
        <div className="detail-image">
          <img
            src={product.image}
            alt={`${product.name} electronics product`}
          />
          <span>LISTED PRODUCT</span>
        </div>
        <div className="detail-copy">
          <span className="kicker">
            {product.category} · {product.location}
          </span>
          <h1>{product.name}</h1>
          <strong className="detail-price">{money(product.price)}</strong>
          <p className="product-rating">★ {product.rating || 0}/5 · {product.ratingCount || 0} ratings · {product.status === "sold" ? "Sold" : "Available"}</p>
          <p className="detail-description">{product.description}</p>
          <div className="specs">
            <div>
              <span>Condition</span>
              <b>{product.condition}</b>
            </div>
            <div>
              <span>Availability</span>
              <b>Available</b>
            </div>
            <div>
              <span>Seller</span>
              <b>{product.seller}</b>
            </div>
          </div>
          <button className="button primary full" onClick={() => add(product)}>
            Add to cart <span>＋</span>
          </button>
          <button
            className="button outline full"
            onClick={() =>
              alert(
                "Contact us on WhatsApp at +250 798 736 364 for seller assistance.",
              )
            }
          >
            Contact seller <span>↗</span>
          </button>
          <p className="small-note">
            Email lenout175@gmail.com or message us on WhatsApp.
          </p>
          <div className="rating-control"><span>Rate this product</span><div>{[1, 2, 3, 4, 5].map((value) => <button key={value} className={value <= score ? "selected" : ""} onClick={() => rateProduct(value)} aria-label={`Rate ${value} out of 5`}>★</button>)}</div>{ratingMessage && <small>{ratingMessage}</small>}</div>
        </div>
      </div>
    </main>
  );
}
function Cart({ cart, updateQty, remove, go }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  return (
    <main className="cart-page">
      <div className="page-intro compact">
        <span className="kicker">YOUR BAG</span>
        <h1>Shopping cart</h1>
        <p>
          {cart.length
            ? `${cart.reduce((s, i) => s + i.qty, 0)} items ready for checkout.`
            : "Your saved products will appear here."}
        </p>
      </div>
      {!cart.length ? (
        <div className="empty-state cart-empty">
          <span className="empty-icon">▱</span>
          <h3>Your cart is empty</h3>
          <p>Find something useful for your setup.</p>
          <button className="button primary" onClick={() => go("shop")}>
            Browse products <span>↗</span>
          </button>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} />
                <div className="cart-item-copy">
                  <span className="eyebrow">{item.category}</span>
                  <h3>{item.name}</h3>
                  <p>{money(item.price)}</p>
                  <div className="qty">
                    <button onClick={() => updateQty(item.id, -1)}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)}>+</button>
                  </div>
                </div>
                <button
                  className="remove"
                  onClick={() => remove(item.id)}
                  aria-label={`Remove ${item.name}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <aside className="summary">
            <span className="kicker">ORDER SUMMARY</span>
            <div>
              <span>Subtotal</span>
              <b>{money(total)}</b>
            </div>
            <div>
              <span>Delivery</span>
              <span className="muted">To be confirmed</span>
            </div>
            <hr />
            <div className="total">
              <span>Total</span>
              <b>{money(total)}</b>
            </div>
            <button
              className="button primary full"
              onClick={() => go("checkout")}
            >
              Proceed to checkout <span>↗</span>
            </button>
            <button className="button outline full" onClick={() => go("shop")}>
              Continue shopping
            </button>
          </aside>
        </div>
      )}
    </main>
  );
}
function Auth({ type, login, register, go }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const isLogin = type === "login";
  const submit = async (e) => {
    e.preventDefault();
    if (
      !form.email ||
      !form.password ||
      (!isLogin && (!form.name || form.password !== form.confirm))
    )
      return setError(
        isLogin
          ? "Please enter your email and password."
          : "Complete all fields and make sure passwords match.",
      );
    setError("");
    if (isLogin) return login(form);
    const result = await register(otpSent ? { ...form, otp } : form);
    if (result?.error) return setError(result.error);
    if (result?.needsOtp) { setOtpSent(true); if (result.developmentOtp) setError(`Verification code: ${result.developmentOtp}`); }
  };
  return (
    <main className="auth-page">
      <div className="auth-aside">
        <Logo onClick={() => go("home")} />
        <div>
          <span className="kicker">THE SMARTER MARKETPLACE</span>
          <h2>
            Tech that fits
            <br />
            <em>your life.</em>
          </h2>
        </div>
        <span className="aside-foot">gura&ugurisha · Rwanda</span>
      </div>
      <div className="auth-form">
        <button className="back-link" onClick={() => go("home")}>
          ← Back home
        </button>
        <span className="kicker">
          {isLogin ? "WELCOME BACK" : "JOIN THE MARKETPLACE"}
        </span>
        <h1>{isLogin ? "Log in to your account" : "Create your account"}</h1>
        <p className="form-intro">
          {isLogin
            ? "Your saved products and listings are waiting."
            : "Buy better. Sell smarter. It starts here."}
        </p>
        <form onSubmit={submit}>
          {!isLogin && (
            <label>
              Full name
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your full name"
              />
            </label>
          )}
          {!isLogin && otpSent && (
            <label>
              Email verification code
              <input inputMode="numeric" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter the 6-digit code" maxLength="6" required />
            </label>
          )}
          <label>
            Email address
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
          </label>
          {!isLogin && (
            <label>
              Phone number
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="07X XXX XXX"
              />
            </label>
          )}
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter your password"
            />
          </label>
          {!isLogin && (
            <label>
              Confirm password
              <input
                type="password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                placeholder="Repeat your password"
              />
            </label>
          )}
          {error && <p className="form-error">{error}</p>}
          <button className="button primary full" type="submit">
            {isLogin ? "Log in" : otpSent ? "Verify email" : "Send verification code"} <span>↗</span>
          </button>
        </form>
        <p className="switch-auth">
          {isLogin ? "New to gura&ugurisha?" : "Already have an account?"}{" "}
          <button onClick={() => go(isLogin ? "register" : "login")}>
            {isLogin ? "Create an account" : "Log in"}
          </button>
        </p>
        <p className="small-note">
          Your account is protected with secure sign-in.
        </p>
      </div>
    </main>
  );
}
function Sell({ addListing, go, token }) {
  const [form, setForm] = useState({
    name: "",
    category: "Phones",
    price: "",
    condition: "New",
    location: "Kigali",
    description: "",
    quantity: "1",
  });
  const [sent, setSent] = useState(false);
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const handleImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.match(/^image\/(jpeg|png|webp)$/) || file.size > 4 * 1024 * 1024) {
      setError("Choose a JPG, PNG, or WEBP image smaller than 4 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => { setImage(reader.result); setError(""); };
    reader.readAsDataURL(file);
  };
  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.description) return;
    const listing = {
      ...form,
      price: Number(form.price),
      id: Date.now(),
      image,
      seller: "Your profile",
    };
    let savedListing = listing;
    if (token) {
      const response = await fetch("http://localhost:3001/api/products", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(listing) });
      if (!response.ok) { const result = await response.json(); setError(result.error || "Could not publish this product."); return; }
      savedListing = (await response.json()).product;
    }
    addListing(savedListing);
    setSent(true);
  };
  if (sent)
    return (
      <main className="success-page">
        <span className="success-mark">✓</span>
        <span className="kicker">LISTING SAVED</span>
        <h1>
          Your product is
          <br />
          <em>ready to be seen.</em>
        </h1>
        <p>
          Your listing has been saved and is ready for buyers to discover.
        </p>
        <div>
          <button className="button primary" onClick={() => go("dashboard")}>
            View dashboard <span>↗</span>
          </button>
          <button className="button text-button" onClick={() => setSent(false)}>
            Add another
          </button>
        </div>
      </main>
    );
  return (
    <main className="form-page">
      <div className="page-intro compact">
        <span className="kicker">SELL WITH US</span>
        <h1>List a product</h1>
        <p>Give a great device a second life with a clear, honest listing.</p>
      </div>
      <form className="listing-form" onSubmit={submit}>
        <div className="form-section">
          <span className="step">01</span>
          <div>
            <h2>Product details</h2>
            <p>Tell buyers what you are offering.</p>
          </div>
        </div>
        <label>
          Product name *
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. iPhone 13 Pro"
            required
          />
        </label>
        <div className="form-row">
          <label>
            Category *
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {categories.slice(1).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Price (RWF) *
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="250000"
              required
              min="1"
            />
          </label>
        </div>
        <div className="form-row">
          <label>
            Condition
            <select
              value={form.condition}
              onChange={(e) => setForm({ ...form, condition: e.target.value })}
            >
              <option>New</option>
              <option>Like new</option>
              <option>Good</option>
            </select>
          </label>
          <label>
            Location
            <select
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            >
              <option>Kigali</option>
              <option>Huye</option>
              <option>Musanze</option>
              <option>Other</option>
            </select>
          </label>
        </div>
        <label>
          Description *
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe the product's condition, features and what is included."
            rows="5"
            required
          />
        </label>
        <div className="image-upload">
          <label className="upload-control">
            <span>＋</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImage} />
          </label>
          <div>
            <b>Product images</b>
            <p>{image ? "Image selected. You can replace it before publishing." : "Add a clear JPG, PNG, or WEBP image, up to 4 MB."}</p>
          </div>
          {image && <img className="image-preview" src={image} alt="Selected product preview" />}
        </div>
        {error && <p className="form-error">{error}</p>}
        <div className="form-actions">
          <button
            type="button"
            className="button outline"
            onClick={() => go("home")}
          >
            Cancel
          </button>
          <button className="button primary" type="submit">
            Publish listing <span>↗</span>
          </button>
        </div>
      </form>
    </main>
  );
}
function Checkout({ cart, go, token, clearCart }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const [placed, setPlaced] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", location: "" });
  const submit = async (event) => {
    event.preventDefault();
    if (!token) return setError("Please log in before placing an order.");
    const response = await fetch("http://localhost:3001/api/orders", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ ...form, items: cart }) });
    const result = await response.json();
    if (!response.ok) return setError(result.error || "Could not place this order.");
    clearCart(); setPlaced(true);
  };
  if (placed)
    return (
      <main className="success-page">
        <span className="success-mark">✓</span>
        <span className="kicker">ORDER RECEIVED</span>
        <h1>
          Thanks for
          <br />
          <em>shopping local.</em>
        </h1>
        <p>
          Your order has been recorded. We will contact you to confirm delivery and payment.
        </p>
        <button className="button primary" onClick={() => go("home")}>
          Back to home <span>↗</span>
        </button>
      </main>
    );
  return (
    <main className="checkout-page">
      <div className="page-intro compact">
        <span className="kicker">CHECKOUT</span>
        <h1>Almost yours.</h1>
        <p>Complete the details below to review your order.</p>
      </div>
      <div className="checkout-layout">
        <form
          className="checkout-form"
          onSubmit={submit}
        >
          <h2>Customer information</h2>
          <div className="form-row">
            <label>
              Full name
              <input required placeholder="Your full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </label>
            <label>
              Email address
              <input type="email" required placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </label>
          </div>
          <label>
            Phone number
            <input required placeholder="07X XXX XXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </label>
          <label>
            Delivery / location
            <input required placeholder="City or neighborhood" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </label>
          <div className="payment-placeholder">
            <span className="card-symbol">▣</span>
            <div>
              <b>Card payment integration</b>
              <p>
                Payment confirmation will be handled securely by our team.
              </p>
            </div>
          </div>
          {error && <p className="form-error">{error}</p>}
          <button className="button primary full" type="submit">
            Place order <span>↗</span>
          </button>
        </form>
        <aside className="summary">
          <span className="kicker">ORDER SUMMARY</span>
          {cart.map((item) => (
            <div className="summary-item" key={item.id}>
              <span>
                {item.name} <b>× {item.qty}</b>
              </span>
              <strong>{money(item.price * item.qty)}</strong>
            </div>
          ))}
          <hr />
          <div className="total">
            <span>Total</span>
            <b>{money(total)}</b>
          </div>
        </aside>
      </div>
    </main>
  );
}
function Repair({ go }) {
  const [form, setForm] = useState({
    device: "Phone",
    brand: "",
    issue: "",
    location: "Kigali",
    pickup: "Drop off",
  });
  const [sent, setSent] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (form.brand && form.issue) setSent(true);
  };
  if (sent)
    return (
      <main className="repair-success success-page">
        <span className="success-mark">✓</span>
        <span className="kicker">REPAIR REQUEST SAVED</span>
        <h1>
          We have your
          <br />
          <em>device details.</em>
        </h1>
        <p>
          Our repair team will contact you with the next available appointment.
        </p>
        <button className="button primary" onClick={() => go("home")}>
          Back to home <span>↗</span>
        </button>
      </main>
    );
  return (
    <main className="repair-page">
      <section className="repair-hero">
        <div>
          <span className="kicker">THE REPAIR DESK</span>
          <h1>
            Keep your tech
            <br />
            <em>in the game.</em>
          </h1>
          <p>
            Tell us what is wrong with your device and prepare a repair request
            in under a minute.
          </p>
          <div className="repair-stats">
            <span>
              <b>01</b> Diagnose the issue
            </span>
            <span>
              <b>02</b> Choose a handover
            </span>
            <span>
              <b>03</b> Get a follow-up
            </span>
          </div>
        </div>
        <div className="repair-visual">
          <span>DEVICE CARE / 2026</span>
          <div className="repair-device">⌁</div>
          <b>
            From cracked screens
            <br />
            to tired batteries.
          </b>
        </div>
      </section>
      <section className="repair-body">
        <div className="repair-intro">
          <span className="kicker">START A REQUEST</span>
          <h2>What needs attention?</h2>
          <p>
            Share the device details and our repair team will follow up with pricing and availability.
          </p>
        </div>
        <form className="repair-form" onSubmit={submit}>
          <div className="form-row">
            <label>
              Device type
              <select
                value={form.device}
                onChange={(e) => setForm({ ...form, device: e.target.value })}
              >
                <option>Phone</option>
                <option>Laptop</option>
                <option>Tablet</option>
                <option>TV</option>
                <option>Camera</option>
                <option>Game console</option>
                <option>Audio device</option>
              </select>
            </label>
            <label>
              Brand / model *
              <input
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                placeholder="e.g. iPhone 13"
                required
              />
            </label>
          </div>
          <label>
            What is happening? *
            <textarea
              value={form.issue}
              onChange={(e) => setForm({ ...form, issue: e.target.value })}
              placeholder="Describe the problem, symptoms or damage."
              rows="5"
              required
            />
          </label>
          <div className="repair-options">
            <span className="option-title">Preferred handover</span>
            <label className="radio-option">
              <input
                type="radio"
                name="pickup"
                checked={form.pickup === "Drop off"}
                onChange={() => setForm({ ...form, pickup: "Drop off" })}
              />{" "}
              Drop off at a partner desk
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="pickup"
                checked={form.pickup === "Collection"}
                onChange={() => setForm({ ...form, pickup: "Collection" })}
              />{" "}
              Request collection details
            </label>
          </div>
          <label>
            Preferred area
            <select
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            >
              <option>Kigali</option>
              <option>Huye</option>
              <option>Musanze</option>
              <option>Rubavu</option>
            </select>
          </label>
          <button className="button primary" type="submit">
            Send repair request <span>↗</span>
          </button>
        </form>
      </section>
    </main>
  );
}
function Dashboard({ user, listings, go, logout, token, setListings }) {
  useEffect(() => { if (token) fetch("http://localhost:3001/api/my/products", { headers: { Authorization: `Bearer ${token}` } }).then((response) => response.json()).then((result) => { if (result.products) setListings(result.products); }).catch(() => {}); }, [token, setListings]);
  const setProductStatus = async (item) => {
    const status = item.status === "sold" ? "market" : "sold";
    const response = await fetch(`http://localhost:3001/api/products/${item.id}/status`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ status }) });
    if (response.ok) setListings((current) => current.map((listing) => listing.id === item.id ? { ...listing, status } : listing));
  };
  return (
    <main className="dashboard">
      <div className="dash-head">
        <div>
          <span className="kicker">YOUR SPACE</span>
          <h1>Good to see you, {user?.name?.split(" ")[0] || "there"}.</h1>
          <p>Manage your marketplace activity in one place.</p>
        </div>
        <button className="button outline" onClick={logout}>
          Log out
        </button>
      </div>
      <div className="dashboard-grid">
        <section>
          <div className="dash-title">
            <h2>My listings</h2>
            <button onClick={() => go("sell")}>+ Add product</button>
          </div>
          {listings.length ? (
            listings.map((item) => (
              <div className="listing-row" key={item.id}>
                <img src={item.image} alt={item.name} />
                <div>
                  <b>{item.name}</b>
                  <span>
                    {money(item.price)} · {item.location}
                  </span>
                </div>
                <button className={`status-pill ${item.status === "sold" ? "danger" : "live"}`} onClick={() => setProductStatus(item)}>{item.status === "sold" ? "Sold · mark available" : "Available · mark sold"}</button>
              </div>
            ))
          ) : (
            <div className="dash-empty">
              <p>You have not listed anything yet.</p>
              <button onClick={() => go("sell")}>
                Create your first listing ↗
              </button>
            </div>
          )}
        </section>
        <section className="activity">
          <h2>Quick links</h2>
          <button onClick={() => go("cart")}>
            <span>▱</span>
            <div>
              <b>Your cart</b>
              <small>Review saved products</small>
            </div>
            ↗
          </button>
          <button onClick={() => go("shop")}>
            <span>⌕</span>
            <div>
              <b>Browse marketplace</b>
              <small>Find something new</small>
            </div>
            ↗
          </button>
          <div className="account-callout">
            <span>i</span>
            <p>
              Your marketplace activity is connected to your account.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
function Admin({ token, logout }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  useEffect(() => {
    fetch("http://localhost:3001/api/admin/overview", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        setData(result);
      })
      .catch((requestError) => setError(requestError.message));
  }, [token]);
  const updateUserStatus = async (userId, trustStatus) => {
    setActionError("");
    const response = await fetch(`http://localhost:3001/api/admin/users/${userId}`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ trustStatus }) });
    const result = await response.json();
    if (!response.ok) return setActionError(result.error || "Could not update user status.");
    setData((current) => ({ ...current, recentUsers: current.recentUsers.map((item) => item.id === userId ? result.user : item) }));
  };
  const deleteProduct = async (productId) => {
    if (!window.confirm("Delete this published product?")) return;
    setActionError("");
    const response = await fetch(`http://localhost:3001/api/admin/products/${productId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    const result = await response.json();
    if (!response.ok) return setActionError(result.error || "Could not delete product.");
    setData((current) => ({ ...current, products: current.products.filter((item) => String(item.id) !== String(productId)), metrics: { ...current.metrics, products: current.metrics.products - 1 } }));
  };
  const updateProductStatus = async (productId, status) => {
    const response = await fetch(`http://localhost:3001/api/products/${productId}/status`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ status }) });
    if (response.ok) setData((current) => ({ ...current, products: current.products.map((item) => String(item.id) === String(productId) ? { ...item, status } : item) }));
  };
  if (error)
    return (
      <main className="dashboard">
        <div className="page-intro compact">
          <span className="kicker">ADMIN ACCESS</span>
          <h1>Access unavailable.</h1>
          <p>{error}</p>
          <button className="button outline" onClick={logout}>
            Log out
          </button>
        </div>
      </main>
    );
  if (!data)
    return (
      <main className="dashboard">
        <div className="page-intro compact">
          <span className="kicker">ADMIN OVERVIEW</span>
          <h1>Loading usage.</h1>
        </div>
      </main>
    );
  return (
    <main className="dashboard">
      <div className="dash-head">
        <div>
          <span className="kicker">ADMIN OVERVIEW</span>
          <h1>Website usage.</h1>
          <p>Monitor marketplace activity from the last seven days.</p>
        </div>
        <button className="button outline" onClick={logout}>
          Log out
        </button>
      </div>
      {actionError && <p className="form-error">{actionError}</p>}
      <div className="dashboard-grid">
        <section>
          <div className="dash-title">
            <h2>Key metrics</h2>
          </div>
          <div className="trust-items">
            <div>
              <b>{data.metrics.users}</b>
              <span>Registered users</span>
            </div>
            <div>
              <b>{data.metrics.products}</b>
              <span>Products</span>
            </div>
            <div>
              <b>{data.metrics.orders}</b>
              <span>Orders</span>
            </div>
            <div>
              <b>{data.metrics.repairs}</b>
              <span>Repair requests</span>
            </div>
            <div>
              <b>{data.metrics.pageViews7d}</b>
              <span>Page views, 7d</span>
            </div>
            <div>
              <b>{data.metrics.activeSessions7d}</b>
              <span>Active sessions, 7d</span>
            </div>
          </div>
        </section>
        <section className="activity">
          <h2>Popular pages</h2>
          {data.popularPages.length ? (
            data.popularPages.map((item) => (
              <div className="listing-row" key={item.page}>
                <div>
                  <b>{item.page}</b>
                  <span>{item.views} views</span>
                </div>
              </div>
            ))
          ) : (
            <p className="muted">No page-view data yet.</p>
          )}
        </section>
      </div>
      <section className="dashboard-grid">
        <div>
          <div className="dash-title">
            <h2>Recent users</h2>
          </div>
          {data.recentUsers.map((item) => (
            <div className="listing-row" key={item.id}>
              <div>
                <b>{item.name}</b>
                <span>{item.email} · {item.trustStatus}</span>
              </div>
              <div className="admin-actions">
                <button className="status-pill live" onClick={() => updateUserStatus(item.id, "legit")}>Legit</button>
                <button className="status-pill danger" onClick={() => updateUserStatus(item.id, "scam")}>Scam</button>
              </div>
            </div>
          ))}
        </div>
        <div className="activity">
          <h2>Recent orders</h2>
          {data.recentOrders.length ? (
            data.recentOrders.map((item) => (
              <div className="listing-row" key={item.id}>
                <div>
                  <b>{item.location}</b>
                  <span>{item.status}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="muted">No orders yet.</p>
          )}
        </div>
      </section>
      <section className="dashboard-section">
        <div className="dash-title"><h2>Published products</h2></div>
        {data.products.length ? data.products.map((item) => (
          <div className="listing-row" key={item.id}>
            <div><b>{item.name}</b><span>{item.category} · {money(item.price)} · {item.seller} · ★ {item.rating || 0}/5 ({item.ratingCount || 0})</span></div>
            <div className="admin-actions"><button className={`status-pill ${item.status === "sold" ? "danger" : "live"}`} onClick={() => updateProductStatus(item.id, item.status === "sold" ? "market" : "sold")}>{item.status === "sold" ? "Sold" : "On market"}</button><button className="status-pill danger" onClick={() => deleteProduct(item.id)}>Delete</button></div>
          </div>
        )) : <p className="muted">No published products.</p>}
      </section>
    </main>
  );
}
export default function App() {
  const [page, setPage] = useState("home");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [language, setLanguage] = useState(
    () => localStorage.getItem("gura-language") || "en",
  );
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("gura-user") || "null"),
  );
  const [token, setToken] = useState(() => localStorage.getItem("gura-token") || "");
  const [cart, setCart] = useState(() =>
    JSON.parse(localStorage.getItem("gura-cart") || "[]"),
  );
  const [listings, setListings] = useState(() =>
    JSON.parse(localStorage.getItem("gura-listings") || "[]"),
  );
  useEffect(() => {
    localStorage.setItem("gura-language", language);
    document.documentElement.lang = language === "rw" ? "rw" : "en";
  }, [language]);
  useEffect(
    () => localStorage.setItem("gura-cart", JSON.stringify(cart)),
    [cart],
  );
  useEffect(
    () => localStorage.setItem("gura-listings", JSON.stringify(listings)),
    [listings],
  );
  useEffect(() => {
    if (user) localStorage.setItem("gura-user", JSON.stringify(user));
    else localStorage.removeItem("gura-user");
  }, [user]);
  const go = (next, category) => {
    setPage(next);
    if (category) setQuery(category);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const add = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      return existing
        ? current.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
          )
        : [...current, { ...product, qty: 1 }];
    });
  };
  const updateQty = (id, change) =>
    setCart((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(1, item.qty + change) }
          : item,
      ),
    );
  const remove = (id) =>
    setCart((current) => current.filter((item) => item.id !== id));
  const login = async (details) => {
    try {
      const response = await fetch("http://localhost:3001/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(details) });
      if (response.ok) {
        const result = await response.json();
        setUser(result.user); setToken(result.token); localStorage.setItem("gura-token", result.token);
        go(result.user.role === "admin" ? "admin" : "dashboard");
        return;
      }
    } catch { /* Keep browsing available when the API is offline. */ }
    setUser({ name: details.email.split("@")[0], email: details.email, role: "user" });
    go("dashboard");
  };
  const register = async (details) => {
    try {
      const endpoint = details.otp ? "register/verify" : "register/start";
      const response = await fetch(`http://localhost:3001/api/auth/${endpoint}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(details) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Registration failed.");
      if (!details.otp) return { needsOtp: true, developmentOtp: result.developmentOtp };
      setUser(result.user); setToken(result.token); localStorage.setItem("gura-token", result.token); go("dashboard"); return { success: true };
    } catch (requestError) {
      return { error: requestError.message };
    }
  };
  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("gura-token");
    go("home");
  };
  let content = (
    <Home
      go={go}
      add={add}
      language={language}
      open={(p) => {
        setSelected(p);
        go("detail");
      }}
    />
  );
  if (page === "shop")
    content = (
      <Shop
        query={query}
        setQuery={setQuery}
        language={language}
        add={add}
        open={(p) => {
          setSelected(p);
          go("detail");
        }}
      />
    );
  if (page === "detail" && selected)
    content = <Detail product={selected} add={add} go={go} token={token} />;
  if (page === "cart")
    content = (
      <Cart cart={cart} updateQty={updateQty} remove={remove} go={go} />
    );
  if (page === "checkout") content = <Checkout cart={cart} go={go} token={token} clearCart={() => setCart([])} />;
  if (page === "login" || page === "register")
    content = <Auth type={page} login={login} register={register} go={go} />;
  if (page === "sell")
    content = (
      <Sell
        addListing={(listing) => setListings([...listings, listing])}
        go={go}
        token={token}
      />
    );
  if (page === "dashboard")
    content = user ? (
      <Dashboard user={user} listings={listings} go={go} logout={logout} token={token} setListings={setListings} />
    ) : (
      <Auth type="login" login={login} register={register} go={go} />
    );
  if (page === "admin")
    content = user?.role === "admin" ? (
      <Admin token={token} logout={logout} />
    ) : (
      <Auth type="login" login={login} register={register} go={go} />
    );
  const standalone = page === "login" || page === "register";
  return (
    <div className={standalone ? "app standalone" : "app"}>
      {!standalone && (
        <Header
          page={page}
          go={go}
          cartCount={cart.reduce((sum, item) => sum + item.qty, 0)}
          query={query}
          setQuery={setQuery}
          language={language}
          setLanguage={setLanguage}
          user={user}
          logout={logout}
        />
      )}
      {content}
      <WhatsAppFloat />
    </div>
  );
}
