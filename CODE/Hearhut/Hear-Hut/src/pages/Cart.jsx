import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "../style.css";
import StarRating from "../components/StarRating";

function Cart() {
  const { cart, setCart } = useContext(CartContext);
  const { isAuthenticated, user, signOut } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Ensure quantity exists
  const ensureQuantity = (items) =>
    items.map(item => ({ ...item, quantity: item.quantity || 1 }));

  const safeCart = ensureQuantity(cart);

  function updateQuantity(index, change) {
    setCart(prev =>
      prev.map((item, i) =>
        i === index
          ? { ...item, quantity: Math.max(1, (item.quantity || 1) + change) }
          : item
      )
    );
  }

  function removeFromCart(index) {
    setCart(prev => prev.filter((_, i) => i !== index));
  }

  function clearCart() {
    setCart([]);
  }

  const subtotal = safeCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 5000 ? 0 : (subtotal > 0 ? 99 : 0);
  const total = subtotal + shipping;
  const totalItems = safeCart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-container">
          {isAuthenticated && (
            <div className="user-chip" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <i className="fas fa-user-circle" style={{ fontSize: 22, color: "var(--accent)" }}></i>
              <span style={{ fontWeight: 700 }}>
                {user?.name || (user?.email ? user.email.split("@")[0] : "User")}
              </span>
            </div>
          )}
          <div className="hearhut-logo">
            <i className="fas fa-headphones-alt"></i>
            <Link to="/">
              Hear<span className="highlight">Hut</span>
            </Link>
          </div>

          <div className="nav-center">
            <div className="searchbar">
              <i className="fas fa-search"></i>
              <input
                type="text"
                className="search-input"
                placeholder="Search products..."
                disabled
              />
            </div>
          </div>

          <div className="nav-right">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <Link to="/cart" className="nav-link cart-link active">
              <i className="fas fa-shopping-cart"></i>
              <span className="cart-badge">{cart.length}</span>
            </Link>
            {!isAuthenticated ? (
              <Link to="/signin" className="nav-link">Sign In</Link>
            ) : (
              <button className="nav-link" onClick={signOut}>Sign Out</button>
            )}
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <i className={mobileMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <Link to="/" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/about" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link to="/contact" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            <Link to="/cart" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
              Cart ({cart.length})
            </Link>
            {!isAuthenticated ? (
              <Link to="/signin" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
            ) : (
              <button className="mobile-link" onClick={() => { signOut(); setMobileMenuOpen(false); }}>Sign Out</button>
            )}
          </div>
        )}
      </nav>

      {/* CART PAGE */}
      <div className="cart-page">
        <div className="cart-container">
          <div className="cart-header">
            <h1 className="cart-title">
              <i className="fas fa-shopping-cart"></i>
              Shopping Cart
            </h1>
            {safeCart.length > 0 && (
              <p className="cart-subtitle">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
              </p>
            )}
          </div>

          {safeCart.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">
                <i className="fas fa-shopping-cart"></i>
              </div>
              <h2 className="empty-cart-title">Your cart is empty</h2>
              <p className="empty-cart-text">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Link to="/" className="continue-shopping-btn">
                <i className="fas fa-arrow-left"></i>
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="cart-content">
              <div className="cart-items-section">
                <div className="cart-items-header">
                  <h2>Cart Items</h2>
                  {safeCart.length > 0 && (
                    <button onClick={clearCart} className="clear-cart-btn">
                      <i className="fas fa-trash"></i>
                      Clear Cart
                    </button>
                  )}
                </div>

                <div className="cart-items-list">
                  {safeCart.map((item, index) => (
                    <div key={index} className="cart-item-card">
                      <div className="cart-item-image">
                        <img src={item.img} alt={item.name} />
                      </div>

                      <div className="cart-item-details">
                        <div className="cart-item-brand">{item.brand}</div>
                        <h3 className="cart-item-name">{item.name}</h3>
                        <StarRating rating={item.rating} reviews={item.reviews} />
                        <div className="cart-item-price">
                          ₹{item.price.toLocaleString()}
                          {item.originalPrice > item.price && (
                            <span className="cart-item-original-price">
                              ₹{item.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="cart-item-controls">
                        <div className="quantity-controls">
                          <button
                            onClick={() => updateQuantity(index, -1)}
                            className="quantity-btn"
                            aria-label="Decrease quantity"
                          >
                            <i className="fas fa-minus"></i>
                          </button>
                          <span className="quantity-value">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(index, 1)}
                            className="quantity-btn"
                            aria-label="Increase quantity"
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>

                        <div className="cart-item-total">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </div>

                        <button
                          onClick={() => removeFromCart(index)}
                          className="remove-item-btn"
                          aria-label="Remove item"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="cart-summary">
                <div className="summary-header">
                  <h2>Order Summary</h2>
                </div>

                <div className="summary-content">
                  <div className="summary-row">
                    <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>

                  <div className="summary-row">
                    <span>Shipping</span>
                    <span>{shipping > 0 ? `₹${shipping}` : 'Free'}</span>
                  </div>

                  {subtotal > 5000 && (
                    <div className="summary-discount">
                      <i className="fas fa-tag"></i>
                      <span>Free shipping on orders over ₹5,000!</span>
                    </div>
                  )}

                  <div className="summary-divider"></div>

                  <div className="summary-total">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="summary-actions">
                  <Link to="/checkout" className="checkout-btn">
                    <i className="fas fa-lock"></i>
                    Proceed to Checkout
                  </Link>
                  <Link to="/" className="continue-shopping-link">
                    <i className="fas fa-arrow-left"></i>
                    Continue Shopping
                  </Link>
                </div>

                <div className="summary-features">
                  <div className="summary-feature">
                    <i className="fas fa-shield-alt"></i>
                    <span>Secure Checkout</span>
                  </div>
                  <div className="summary-feature">
                    <i className="fas fa-undo"></i>
                    <span>Easy Returns</span>
                  </div>
                  <div className="summary-feature">
                    <i className="fas fa-truck"></i>
                    <span>Free Shipping</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Cart;
