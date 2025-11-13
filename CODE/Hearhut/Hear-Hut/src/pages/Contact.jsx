import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import emailjs from "@emailjs/browser";
import "../style.css";

function Contact() {
  const { cart } = useContext(CartContext);
  const { isAuthenticated, signOut, user } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [formStatus, setFormStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // EmailJS Configuration
  // Replace these with your EmailJS credentials
  // Get them from: https://www.emailjs.com/
  const EMAILJS_SERVICE_ID = "service_98oy1ge";
  const EMAILJS_TEMPLATE_ID = "template_4si9zc8";
  const EMAILJS_PUBLIC_KEY = "dDpH1yVLN3bpPPI6A";// 
  // 
  // Replace with your public key

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormStatus("");

    // Check if EmailJS is configured
    if (
      EMAILJS_SERVICE_ID === "YOUR_SERVICE_ID" ||
      EMAILJS_TEMPLATE_ID === "YOUR_TEMPLATE_ID" ||
      EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY"
    ) {
      setFormStatus("error");
      setIsLoading(false);
      alert(
        "EmailJS is not configured. Please set up your EmailJS credentials in Contact.jsx. See instructions in the code comments."
      );
      return;
    }

    try {
      // Initialize EmailJS with your public key
      emailjs.init(EMAILJS_PUBLIC_KEY);

      // Send email using EmailJS
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          to_email: "support@hearhut.com", // Your email address
        }
      );

      if (result.text === "OK") {
        setFormStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => {
          setFormStatus("");
        }, 5000);
      }
    } catch (error) {
      console.error("EmailJS Error:", error);
      setFormStatus("error");
      setTimeout(() => {
        setFormStatus("");
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

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
            <Link to="/contact" className="nav-link active">Contact</Link>
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

      {/* CONTACT PAGE */}
      <div className="contact-page">
        {/* Hero Section */}
        <section className="contact-hero">
          <div className="contact-hero-content">
            <h1 className="contact-hero-title">Get in Touch</h1>
            <p className="contact-hero-subtitle">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="contact-section">
          <div className="contact-container">
            <div className="contact-grid">
              {/* Contact Form */}
              <div className="contact-form-wrapper">
                <h2 className="contact-form-title">Send us a Message</h2>
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What is this regarding?"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more..."
                      rows="6"
                      required
                    ></textarea>
                  </div>

                  {formStatus === "success" && (
                    <div className="form-success">
                      <i className="fas fa-check-circle"></i>
                      Message sent successfully! We'll get back to you soon.
                    </div>
                  )}

                  {formStatus === "error" && (
                    <div className="form-error">
                      <i className="fas fa-exclamation-circle"></i>
                      Failed to send message. Please try again or contact us directly.
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Sending...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i>
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="contact-info-wrapper">
                <h2 className="contact-info-title">Contact Information</h2>
                <p className="contact-info-description">
                  Reach out to us through any of these channels. We're here to help!
                </p>

                <div className="contact-info-cards">
                  <div className="contact-info-card">
                    <div className="contact-info-icon">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div className="contact-info-content">
                      <h3>Address</h3>
                      <p>123 Audio Street<br />Mumbai, Maharashtra 400001<br />India</p>
                    </div>
                  </div>

                  <div className="contact-info-card">
                    <div className="contact-info-icon">
                      <i className="fas fa-phone"></i>
                    </div>
                    <div className="contact-info-content">
                      <h3>Phone</h3>
                      <p>+91 98765 43210<br />+91 98765 43211</p>
                    </div>
                  </div>

                  <div className="contact-info-card">
                    <div className="contact-info-icon">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div className="contact-info-content">
                      <h3>Email</h3>
                      <p>support@hearhut.com<br />sales@hearhut.com</p>
                    </div>
                  </div>

                  <div className="contact-info-card">
                    <div className="contact-info-icon">
                      <i className="fas fa-clock"></i>
                    </div>
                    <div className="contact-info-content">
                      <h3>Business Hours</h3>
                      <p>Monday - Friday: 9:00 AM - 8:00 PM<br />Saturday - Sunday: 10:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>

                <div className="social-links-section">
                  <h3>Follow Us</h3>
                  <div className="social-links">
                    <a href="#" className="social-link">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" className="social-link">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" className="social-link">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="#" className="social-link">
                      <i className="fab fa-youtube"></i>
                    </a>
                    <a href="#" className="social-link">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="contact-faq">
          <div className="contact-container">
            <h2 className="faq-title">Frequently Asked Questions</h2>
            <div className="faq-grid">
              <div className="faq-item">
                <h3><i className="fas fa-question-circle"></i> What is your return policy?</h3>
                <p>We offer a 30-day return policy on all products. Items must be in original condition with all accessories included.</p>
              </div>
              <div className="faq-item">
                <h3><i className="fas fa-question-circle"></i> Do you offer free shipping?</h3>
                <p>Yes! We offer free shipping on all orders over ₹5,000. Standard shipping is available for smaller orders.</p>
              </div>
              <div className="faq-item">
                <h3><i className="fas fa-question-circle"></i> How long does delivery take?</h3>
                <p>Standard delivery takes 3-5 business days. Express delivery (1-2 days) is available for an additional charge.</p>
              </div>
              <div className="faq-item">
                <h3><i className="fas fa-question-circle"></i> Are your products authentic?</h3>
                <p>Absolutely! All our products are 100% authentic and sourced directly from authorized dealers and manufacturers.</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-column">
            <h3>HearHut</h3>
            <p>Premium headphones, earbuds, and audio gear to elevate your sound journey.</p>
          </div>

          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-youtube"></i></a>
            </div>
          </div>

          <div className="footer-column">
            <h3>Newsletter</h3>
            <p>Subscribe to get the latest updates and offers.</p>
            <form>
              <input type="email" placeholder="Your email" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 HearHut. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default Contact;

