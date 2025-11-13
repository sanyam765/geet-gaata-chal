import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import "../style.css";
import emailjs from "@emailjs/browser";

function Checkout() {
  const { cart } = useContext(CartContext);
  const { isAuthenticated, signOut, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    shippingMethod: "standard"
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [errors, setErrors] = useState({});
  // EmailJS (reuse same service/template as contact form)
  const EMAILJS_SERVICE_ID = "service_98oy1ge";
  const EMAILJS_TEMPLATE_ID = "template_4si9zc8";
  const EMAILJS_PUBLIC_KEY = "dDpH1yVLN3bpPPI6A";
  // Razorpay test key (replace with your live key in production)
  const RAZORPAY_KEY = "rzp_test_XXXXXXX";

  useEffect(() => {
    if (cart.length === 0 && !orderPlaced) {
      navigate("/cart");
    }
  }, [cart, navigate, orderPlaced]);

  // Load Razorpay script on demand
  const loadRazorpay = () =>
    new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
      document.body.appendChild(script);
    });

  const handleChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  // Simple validators
  const isEmail = (v) => /^\S+@\S+\.\S+$/.test(v);
  const digitsOnly = (v) => v.replace(/\D/g, "");
  const isPhone = (v) => digitsOnly(v).length >= 10;
  const isZip = (v) => /^\d{5,6}$/.test(digitsOnly(v));
  const validateShipping = () => {
    const nextErrors = {};
    if (!formData.firstName.trim()) nextErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) nextErrors.lastName = "Last name is required";
    if (!isEmail(formData.email)) nextErrors.email = "Enter a valid email";
    if (!isPhone(formData.phone)) nextErrors.phone = "Enter a valid phone number";
    if (!formData.address.trim()) nextErrors.address = "Address is required";
    if (!formData.city.trim()) nextErrors.city = "City is required";
    if (!formData.state.trim()) nextErrors.state = "State is required";
    if (!isZip(formData.zipCode)) nextErrors.zipCode = "Enter a valid ZIP/Postal code";
    if (!formData.country) nextErrors.country = "Country is required";
    if (!formData.shippingMethod) nextErrors.shippingMethod = "Select a shipping method";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // Trigger Razorpay payment and finalize order on success
  const startPayment = async () => {
    // Guards
    if (!validateShipping()) return;
    try {
      await loadRazorpay();
    } catch (e) {
      alert("Payment gateway failed to load. Please check your connection and try again.");
      return;
    }
    const shippingCost = formData.shippingMethod === "express" ? 299 : (subtotal > 5000 ? 0 : 99);
    const payable = Math.round(subtotal + shippingCost + tax); // INR
    const amountInPaise = payable * 100;
    const orderId = "HH-" + Math.random().toString(36).slice(2, 10).toUpperCase();

    const options = {
      key: RAZORPAY_KEY,
      amount: amountInPaise,
      currency: "INR",
      name: "HearHut",
      description: `Order ${orderId}`,
      image: undefined,
      handler: function (response) {
        // response.razorpay_payment_id, etc.
        finalizeOrder(orderId, payable);
      },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        contact: formData.phone
      },
      notes: {
        shipping_method: formData.shippingMethod
      },
      theme: {
        color: "#ff595a"
      },
      modal: {
        ondismiss: function () {
          // user closed the modal
        }
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // Send confirmation email and show success screen
  const finalizeOrder = (orderId, payable) => {
    const itemsList = safeCart
      .map((it) => `• ${it.name} x${it.quantity} - ₹${(it.price * it.quantity).toLocaleString()}`)
      .join("\n");
    try {
      emailjs.init(EMAILJS_PUBLIC_KEY);
      emailjs
        .send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: "HearHut",
          from_email: "no-reply@hearhut.com",
          to_email: formData.email,
          subject: `Your HearHut Order ${orderId} is Confirmed`,
          message:
            `Hi ${formData.firstName},\n\n` +
            `Thank you for your purchase! Your order ${orderId} has been placed successfully.\n\n` +
            `Items:\n${itemsList}\n\n` +
            `Shipping: ${formData.shippingMethod === "express" ? "Express (1-2 days)" : "Standard (3-5 days)"}\n` +
            `Shipping Address:\n${formData.firstName} ${formData.lastName}\n${formData.address}\n${formData.city}, ${formData.state} ${formData.zipCode}\n${formData.country}\n\n` +
              `Order Total: ₹${payable.toLocaleString()}\n\n` +
            `We'll send another email when your items ship.\n\n` +
            `— HearHut Team`
        }
        )
        .catch((err) => {
        console.error("EmailJS send error:", err);
      });
    } catch (err) {
      console.error("EmailJS init error:", err);
    }
    // Save order details in localStorage
    try {
      const { email } = user || {};
      const orderUserKey = email ? `orders_${email}` : 'orders_guest';
      const prevOrders = JSON.parse(localStorage.getItem(orderUserKey) || '[]');
      const order = {
        id: orderId,
        cart: safeCart,
        formData: {...formData},
        total: payable,
        date: new Date().toISOString(),
      };
      prevOrders.push(order);
      localStorage.setItem(orderUserKey, JSON.stringify(prevOrders));
    } catch (err) {
      console.error("Error saving order in localStorage", err);
    }
    setOrderPlaced(true);
  };

  const ensureQuantity = (items) =>
    items.map(item => ({ ...item, quantity: item.quantity || 1 }));

  const safeCart = ensureQuantity(cart);
  const subtotal = safeCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 5000 ? 0 : (subtotal > 0 ? 99 : 0);
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;
  const totalItems = safeCart.reduce((sum, item) => sum + item.quantity, 0);

  if (orderPlaced) {
    return (
      <>
        <nav className="navbar">
          <div className="nav-container">
            <div className="hearhut-logo">
              <i className="fas fa-headphones-alt"></i>
              <Link to="/">
                Hear<span className="highlight">Hut</span>
              </Link>
            </div>
            <div className="nav-right">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/shop" className="nav-link">Shop</Link>
            </div>
          </div>
        </nav>

        <div className="checkout-success">
          <div className="success-container">
            <div className="success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h1 className="success-title">Order Placed Successfully!</h1>
            <p className="success-message">
              Thank you for your purchase. Your order has been confirmed and you will receive an email shortly.
            </p>
            <div className="success-actions">
              <Link to="/shop" className="continue-shopping-btn">
                <i className="fas fa-shopping-bag"></i>
                Continue Shopping
              </Link>
              <Link to="/" className="home-btn">
                <i className="fas fa-home"></i>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

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
            <Link to="/shop" className="nav-link">Shop</Link>
            <Link to="/cart" className="nav-link cart-link">
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

        {mobileMenuOpen && (
          <div className="mobile-menu">
            <Link to="/" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/shop" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
            <Link to="/cart" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
              Cart ({cart.length})
            </Link>
          </div>
        )}
      </nav>

      {/* CHECKOUT PAGE */}
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-content">
            <div className="checkout-form-section">
                  <h2 className="step-title">
                    <i className="fas fa-truck"></i>
                Checkout
                  </h2>
                  <form className="checkout-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="firstName">First Name *</label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                        {errors.firstName && <small className="form-error" style={{ padding: "8px", marginTop: "4px" }}>{errors.firstName}</small>}
                      </div>
                      <div className="form-group">
                        <label htmlFor="lastName">Last Name *</label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                        {errors.lastName && <small className="form-error" style={{ padding: "8px", marginTop: "4px" }}>{errors.lastName}</small>}
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      {errors.email && <small className="form-error" style={{ padding: "8px", marginTop: "4px" }}>{errors.email}</small>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone">Phone Number *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                      {errors.phone && <small className="form-error" style={{ padding: "8px", marginTop: "4px" }}>{errors.phone}</small>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="address">Street Address *</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                      />
                      {errors.address && <small className="form-error" style={{ padding: "8px", marginTop: "4px" }}>{errors.address}</small>}
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="city">City *</label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                        />
                        {errors.city && <small className="form-error" style={{ padding: "8px", marginTop: "4px" }}>{errors.city}</small>}
                      </div>
                      <div className="form-group">
                        <label htmlFor="state">State *</label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          required
                        />
                        {errors.state && <small className="form-error" style={{ padding: "8px", marginTop: "4px" }}>{errors.state}</small>}
                      </div>
                      <div className="form-group">
                        <label htmlFor="zipCode">ZIP Code *</label>
                        <input
                          type="text"
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          required
                        />
                        {errors.zipCode && <small className="form-error" style={{ padding: "8px", marginTop: "4px" }}>{errors.zipCode}</small>}
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="country">Country *</label>
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                      >
                        <option value="India">India</option>
                        <option value="USA">United States</option>
                        <option value="UK">United Kingdom</option>
                        <option value="Canada">Canada</option>
                      </select>
                      {errors.country && <small className="form-error" style={{ padding: "8px", marginTop: "4px" }}>{errors.country}</small>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="shippingMethod">Shipping Method *</label>
                  <div className="shipping-options simple">
                        <label className="shipping-option">
                          <input
                            type="radio"
                            name="shippingMethod"
                            value="standard"
                            checked={formData.shippingMethod === "standard"}
                            onChange={handleChange}
                          />
                          <div className="shipping-option-content">
                            <div>
                              <strong>Standard Shipping</strong>
                              <span>3-5 business days</span>
                            </div>
                            <span className="shipping-price">
                              {subtotal > 5000 ? "Free" : "₹99"}
                            </span>
                          </div>
                        </label>
                        <label className="shipping-option">
                          <input
                            type="radio"
                            name="shippingMethod"
                            value="express"
                            checked={formData.shippingMethod === "express"}
                            onChange={handleChange}
                          />
                          <div className="shipping-option-content">
                            <div>
                              <strong>Express Shipping</strong>
                              <span>1-2 business days</span>
                            </div>
                            <span className="shipping-price">₹299</span>
                          </div>
                        </label>
                      </div>
                      {errors.shippingMethod && <small className="form-error" style={{ padding: "8px", marginTop: "4px" }}>{errors.shippingMethod}</small>}
                    </div>

                    <div className="payment-security">
                      <i className="fas fa-lock"></i>
                  <span>Your payment is handled securely by Razorpay</span>
                </div>

                    <button
                      type="button"
                      className="place-order-btn"
                  onClick={startPayment}
                    >
                      <i className="fas fa-lock"></i>
                  Pay & Place Order
                    </button>
              </form>
            </div>

            {/* Right Side - Order Summary */}
            <div className="checkout-summary">
              <div className="summary-header">
                <h2>Order Summary</h2>
              </div>

              <div className="summary-items">
                {safeCart.map((item, index) => (
                  <div key={index} className="summary-item">
                    <div className="summary-item-image">
                      <img src={item.img} alt={item.name} />
                    </div>
                    <div className="summary-item-details">
                      <h4>{item.name}</h4>
                      <p>{item.brand}</p>
                      <span>Qty: {item.quantity}</span>
                    </div>
                    <div className="summary-item-price">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary-breakdown">
                <div className="summary-row">
                  <span>Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>
                    {formData.shippingMethod === "express" 
                      ? "₹299" 
                      : subtotal > 5000 
                        ? "Free" 
                        : "₹99"}
                  </span>
                </div>
                <div className="summary-row">
                  <span>Tax (GST 18%)</span>
                  <span>₹{Math.round(tax).toLocaleString()}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-total">
                  <span>Total</span>
                  <span>
                    ₹{Math.round(
                      subtotal + 
                      (formData.shippingMethod === "express" ? 299 : (subtotal > 5000 ? 0 : 99)) + 
                      tax
                    ).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="summary-features">
                <div className="summary-feature">
                  <i className="fas fa-shield-alt"></i>
                  <span>Secure Payment</span>
                </div>
                <div className="summary-feature">
                  <i className="fas fa-undo"></i>
                  <span>Easy Returns</span>
                </div>
                <div className="summary-feature">
                  <i className="fas fa-truck"></i>
                  <span>Fast Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Checkout;

