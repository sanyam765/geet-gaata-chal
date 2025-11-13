import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import "../style.css";

function About() {
  const { cart } = useContext(CartContext);
  const { isAuthenticated, signOut, user } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <Link to="/about" className="nav-link active">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
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

      {/* ABOUT PAGE */}
      <div className="about-page">
        {/* Hero */}
        <section className="about-hero">
          <div className="about-hero-content">
            <h1 className="about-hero-title">Crafting Your Perfect Sound</h1>
            <p className="about-hero-subtitle">
              We curate premium headphones, earbuds, and audio gear to elevate every note.
            </p>
          </div>
        </section>

        {/* About Content */}
        <section className="about-section">
          <div className="about-container">
            <div className="about-content-grid">
              <div className="about-text-content">
                <h2 className="about-section-title">Who We Are</h2>
                <p className="about-description">
                  HearHut was built by music lovers, for music lovers. From studio-grade
                  headphones to everyday earbuds, we obsess over detail so you can simply press play.
                </p>
                <p className="about-description">
                  Our team tests every product for comfort, build, tuning, and real-world performance.
                  That’s how we recommend the right gear—whether you need thumping bass, neutral reference,
                  or crystal-clear calls on the move.
                </p>
              </div>

              <div className="about-image-box">
                <div className="about-image-placeholder">
                  <i className="fas fa-music"></i>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="about-values">
          <div className="about-container">
            <h2 className="about-section-title text-center">Our Values</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon"><i className="fas fa-headphones-alt"></i></div>
                <h3>Audio First</h3>
                <p>Sound quality leads every decision—tuned, tested, and trusted.</p>
              </div>
              <div className="value-card">
                <div className="value-icon"><i className="fas fa-star"></i></div>
                <h3>Premium Curation</h3>
                <p>Only the best gear makes the cut, across budgets and brands.</p>
              </div>
              <div className="value-card">
                <div className="value-icon"><i className="fas fa-hand-holding-heart"></i></div>
                <h3>Customer Love</h3>
                <p>We help you find your fit—and we’re here long after checkout.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="about-stats">
          <div className="about-container">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">1K+</div>
                <div className="stat-label">Curated Products</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">Top Audio Brands</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">25K+</div>
                <div className="stat-label">Happy Customers</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">4.9</div>
                <div className="stat-label">Average Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="about-section">
          <div className="about-container">
            <h2 className="about-section-title text-center">Why Shop at HearHut?</h2>
            <div className="features-grid">
              <div className="feature-box">
                <i className="fas fa-shipping-fast"></i>
                <h3>Fast, Safe Shipping</h3>
                <p>Carefully packed and quickly shipped with full tracking.</p>
              </div>
              <div className="feature-box">
                <i className="fas fa-undo"></i>
                <h3>Easy Returns</h3>
                <p>30-day no-hassle returns on eligible products.</p>
              </div>
              <div className="feature-box">
                <i className="fas fa-tools"></i>
                <h3>Local Warranty</h3>
                <p>Authorized dealers and dependable after-sales support.</p>
              </div>
              <div className="feature-box">
                <i className="fas fa-comments"></i>
                <h3>Expert Advice</h3>
                <p>Chat with enthusiasts who actually test what we sell.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="about-cta">
          <div className="cta-content">
            <h2>Ready to Find Your Sound?</h2>
            <p>Explore curated picks for every genre, fit, and budget.</p>
            <Link to="/shop" className="cta-button">
              <i className="fas fa-store"></i> Explore the Shop
            </Link>
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

export default About;
