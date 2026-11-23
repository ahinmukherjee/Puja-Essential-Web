import React, { useEffect, useMemo, useState } from "react";
import "./PujaHome.css";

const ASSET = "/puja-assets/";
const CART_STORAGE_KEY = "puja-essentials-cart-v2";
const ORDERS_STORAGE_KEY = "puja-essentials-orders-v2";

const topProducts = [
  { id: "saree", name: "Traditional Puja Saree", price: 1499, image: "product-saree.png" },
  { id: "diya", name: "Brass Diya (Deep)", price: 299, image: "product-diya.png" },
  { id: "agarbatti", name: "Agarbatti Combo Pack", price: 149, image: "product-agarbatti.png" },
  { id: "thali", name: "Puja Thali Set", price: 799, image: "product-thali.png" },
];

const categories = [
  { name: "Puja Items", image: "category-puja-items.png" },
  { name: "Aarti Items", image: "category-aarti-items.png" },
  { name: "Flowers", image: "category-flowers.png" },
  { name: "Dhoti & Saree", image: "category-dhoti-saree.png" },
  { name: "Incense & Dhoop", image: "category-incense.png" },
  { name: "Puja Thali", image: "category-puja-thali.png" },
];

const money = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function SectionTitle({ children }) {
  return (
    <div className="puja-section-title">
      <span className="puja-title-line" />
      <span className="puja-title-flower" aria-hidden="true">✿</span>
      <h2>{children}</h2>
      <span className="puja-title-flower" aria-hidden="true">✿</span>
      <span className="puja-title-line" />
    </div>
  );
}

export default function PujaHome() {
  const [cart, setCart] = useState(() => readStorage(CART_STORAGE_KEY, []));
  const [orders, setOrders] = useState(() => readStorage(ORDERS_STORAGE_KEY, []));
  const [search, setSearch] = useState("");
  const [activePanel, setActivePanel] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const filteredProducts = useMemo(
    () => topProducts.filter((product) => product.name.toLowerCase().includes(search.trim().toLowerCase())),
    [search]
  );

  function addToCart(product) {
    setCart((current) => {
      const found = current.find((item) => item.id === product.id);
      if (found) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
    setNotice(`${product.name} added to your cart.`);
    window.setTimeout(() => setNotice(""), 2600);
  }

  function changeQuantity(id, change) {
    setCart((current) =>
      current
        .map((item) => item.id === id ? { ...item, quantity: item.quantity + change } : item)
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(id) {
    setCart((current) => current.filter((item) => item.id !== id));
  }

  function placeDemoOrder() {
    if (!cart.length) return;
    const order = {
      id: `PE${Date.now().toString().slice(-8)}`,
      date: new Date().toISOString(),
      status: "Demo order placed",
      items: cart.map(({ id, name, price, quantity }) => ({ id, name, price, quantity })),
      total: cartTotal,
    };
    setOrders((current) => [order, ...current]);
    setCart([]);
    setActivePanel("orders");
    setNotice("Your demo order has been saved in Order History.");
    window.setTimeout(() => setNotice(""), 3500);
  }

  function closePanel() {
    setActivePanel(null);
  }

  return (
    <div className="puja-site" id="home">
      <div className="puja-topbar">
        <div className="puja-topbar-contact">
          <a href="tel:+919876543210">☎ <span>+91 98765 43210</span></a>
          <a href="mailto:support@pujaessentials.in">✉ <span>support@pujaessentials.in</span></a>
        </div>
        <div className="puja-topbar-account">
          <button type="button" className="puja-topbar-action" onClick={() => setActivePanel("orders")}>My Orders</button>
          <button type="button" className="puja-cart-link" onClick={() => setActivePanel("cart")} aria-label={`Open cart with ${cartCount} items`}>
            🛒 <span>Cart ({cartCount})</span>
          </button>
        </div>
      </div>

      <header className="puja-header">
        <a className="puja-brand" href="#home" aria-label="Puja Essentials home">
          <img src={`${ASSET}brand-logo.png`} alt="Puja Essentials lotus logo" />
        </a>

        <form className="puja-search" onSubmit={(event) => { event.preventDefault(); document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); }}>
          <input
            type="search"
            placeholder="Search for products..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search products"
          />
          <button type="submit" aria-label="Search">⌕</button>
        </form>

        <nav className="puja-nav" aria-label="Main navigation">
          <a className="active" href="#home">Home</a>
          <a href="#products">Products</a>
          <a href="#categories">Categories</a>
          <a href="#brahmin">Brahmin Booking</a>
          <a href="#about">About Us</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section className="puja-hero" aria-label="Durga Puja collection">
          <img src={`${ASSET}hero-durga-puja.png`} alt="Celebrate the Divine Spirit — Durga Puja" />
        </section>

        <section className="puja-benefits" aria-label="Shopping benefits">
          <div className="puja-benefit"><span className="benefit-icon">🚚</span><strong>Fast Delivery<br />Across India</strong></div>
          <div className="puja-benefit"><span className="benefit-icon">🛡️</span><strong>Secure Payment<br />100% Safe</strong></div>
          <div className="puja-benefit"><span className="benefit-icon">🎧</span><strong>Customer<br />Support</strong></div>
          <div className="puja-benefit"><span className="benefit-icon">🎁</span><strong>Best Quality<br />Products</strong></div>
        </section>

        <section className="puja-section puja-top-products" id="products">
          <SectionTitle>Top Selling Products</SectionTitle>
          <div className="puja-product-grid">
            {filteredProducts.map((product) => (
              <article className="puja-product-card" key={product.id}>
                <div className="puja-product-image">
                  <img src={`${ASSET}${product.image}`} alt={product.name} />
                </div>
                <div className="puja-product-info">
                  <h3>{product.name}</h3>
                  <p className="puja-price">{money(product.price)}</p>
                  <button type="button" onClick={() => addToCart(product)}>🛒 Add to Cart</button>
                </div>
              </article>
            ))}
            {filteredProducts.length === 0 && <p className="puja-no-results">No matching products found. Try another search.</p>}
          </div>
        </section>

        <section className="puja-brahmin" id="brahmin" aria-label="Book a Brahmin">
          <img src={`${ASSET}brahmin-banner.png`} alt="Book a Brahmin for your puja and rituals" />
        </section>

        <section className="puja-section puja-categories" id="categories">
          <SectionTitle>Shop by Categories</SectionTitle>
          <div className="puja-category-grid">
            {categories.map((category) => (
              <a className="puja-category" href="#products" key={category.name} onClick={() => setSearch(category.name === "Dhoti & Saree" ? "Saree" : category.name === "Puja Thali" ? "Thali" : "")}>
                <span className="puja-category-image"><img src={`${ASSET}${category.image}`} alt="" /></span>
                <strong>{category.name}</strong>
              </a>
            ))}
          </div>
        </section>

        <section className="puja-section puja-all-products">
          <div className="puja-all-heading">
            <SectionTitle>All Products</SectionTitle>
            <a href="#products">Explore Products <span>→</span></a>
          </div>
          <img className="puja-all-preview" src={`${ASSET}all-products-preview.png`} alt="More Puja Essentials products including puja cloth, bell, flower garland, book, kalash and incense" />
        </section>

        <section className="puja-about" id="about">
          <h2>Welcome to Puja Essentials</h2>
          <p>Thoughtfully selected essentials for your daily worship, festivals and sacred celebrations.</p>
          <a href="mailto:support@pujaessentials.in">We’re here to help <span>→</span></a>
        </section>
      </main>

      <footer className="puja-footer" id="contact">
        <div className="puja-footer-main">
          <div className="puja-footer-about">
            <div className="puja-footer-brand">✿ Puja Essentials</div>
            <p>Everything you need for your puja, rituals and celebrations — all in one place.</p>
          </div>
          <div className="puja-footer-links">
            <h3>Quick Links</h3>
            <a href="#home">Home</a>
            <a href="#products">Shop Products</a>
            <a href="#categories">Categories</a>
            <button type="button" onClick={() => setActivePanel("orders")}>Order History</button>
          </div>
          <div className="puja-footer-links">
            <h3>Customer Support</h3>
            <a href="mailto:support@pujaessentials.in">support@pujaessentials.in</a>
            <a href="tel:+919876543210">+91 98765 43210</a>
            <span>Monday – Saturday</span>
          </div>
        </div>
        <div className="puja-footer-bottom">
          <span>© {new Date().getFullYear()} Puja Essentials. All rights reserved.</span>
          <span>Made with devotion ♡</span>
        </div>
      </footer>

      {notice && <div className="puja-toast" role="status">{notice}</div>}

      {activePanel && (
        <div className="puja-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closePanel(); }}>
          <section className="puja-panel" role="dialog" aria-modal="true" aria-labelledby="puja-panel-title">
            <div className="puja-panel-heading">
              <div>
                <span className="puja-panel-eyebrow">PUJA ESSENTIALS</span>
                <h2 id="puja-panel-title">{activePanel === "cart" ? "Your Shopping Cart" : "Your Order History"}</h2>
              </div>
              <button className="puja-close" type="button" onClick={closePanel} aria-label="Close">×</button>
            </div>

            {activePanel === "cart" ? (
              cart.length ? (
                <>
                  <div className="puja-cart-items">
                    {cart.map((item) => (
                      <article className="puja-cart-item" key={item.id}>
                        <img src={`${ASSET}${item.image}`} alt={item.name} />
                        <div className="puja-cart-item-info">
                          <h3>{item.name}</h3>
                          <strong>{money(item.price)}</strong>
                          <div className="puja-quantity">
                            <button type="button" onClick={() => changeQuantity(item.id, -1)} aria-label={`Decrease ${item.name} quantity`}>−</button>
                            <span>{item.quantity}</span>
                            <button type="button" onClick={() => changeQuantity(item.id, 1)} aria-label={`Increase ${item.name} quantity`}>+</button>
                            <button className="puja-remove" type="button" onClick={() => removeFromCart(item.id)}>Remove</button>
                          </div>
                        </div>
                        <b>{money(item.price * item.quantity)}</b>
                      </article>
                    ))}
                  </div>
                  <div className="puja-cart-total"><span>Subtotal</span><strong>{money(cartTotal)}</strong></div>
                  <p className="puja-demo-note">Demo checkout only. No payment will be collected and no real order will be sent to a server.</p>
                  <button className="puja-checkout" type="button" onClick={placeDemoOrder}>Place Demo Order</button>
                </>
              ) : (
                <div className="puja-empty-state"><span>🛍️</span><h3>Your cart is empty</h3><p>Add a few puja essentials and they’ll appear here.</p><button type="button" onClick={closePanel}>Continue Shopping</button></div>
              )
            ) : (
              orders.length ? (
                <div className="puja-order-list">
                  {orders.map((order) => (
                    <article className="puja-order-card" key={order.id}>
                      <div className="puja-order-top"><strong>Order #{order.id}</strong><span>{new Date(order.date).toLocaleString("en-IN")}</span></div>
                      <span className="puja-order-status">{order.status}</span>
                      <ul>{order.items.map((item) => <li key={item.id}>{item.name} × {item.quantity} <span>{money(item.price * item.quantity)}</span></li>)}</ul>
                      <div className="puja-order-total"><span>Order Total</span><strong>{money(order.total)}</strong></div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="puja-empty-state"><span>📦</span><h3>No orders yet</h3><p>Your placed demo orders will be saved here so you can review them later on this browser.</p><button type="button" onClick={closePanel}>Continue Shopping</button></div>
              )
            )}
          </section>
        </div>
      )}
    </div>
  );
}
