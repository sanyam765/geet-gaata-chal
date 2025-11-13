import React, { useContext, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style.css";
import products from "../data/product.js";
import { CartContext } from "../context/CartContext";
import StarRating from "../components/StarRating";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const { cart, addToCart } = useContext(CartContext);
  const { isAuthenticated, signOut, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [filterBy, setFilterBy] = useState("all");
  const [recentlyAdded, setRecentlyAdded] = useState({});
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Toggle wishlist
  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const isInWishlist = prev.some((item) => item.id === product.id);
      const newWishlist = isInWishlist
        ? prev.filter((item) => item.id !== product.id)
        : [...prev, product];
      localStorage.setItem("wishlist", JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  // Add to cart with temporary "Added" feedback
  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      navigate("/signin");
      return;
    }
    addToCart(product);
    setRecentlyAdded((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setRecentlyAdded((prev) => {
        const copy = { ...prev };
        delete copy[product.id];
        return copy;
      });
    }, 1500);
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        filterBy === "all" || product.brand.toLowerCase() === filterBy.toLowerCase();
      return matchesSearch && matchesFilter;
    });

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => {
          const ratingA = a.rating.match(/★/g)?.length || 0;
          const ratingB = b.rating.match(/★/g)?.length || 0;
          return ratingB - ratingA;
        });
        break;
      default:
        break;
    }

    return filtered;
  }, [searchQuery, sortBy, filterBy]);

  // Get unique brands for filter
  const brands = useMemo(() => {
    return ["all", ...new Set(products.map((p) => p.brand))];
  }, []);

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="nav-right">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
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

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <p className="hero-subtitle">Your Sound Journey Starts Here</p>
            <h1 className="hero-title">
              <span className="hero-line">Plug in.</span>
              <span className="hero-line">Tune Out.</span>
              <span className="hero-line">Elevate.</span>
            </h1>
            <p className="hero-description">
              Discover premium audio gear that transforms your listening experience. 
              From wireless earbuds to studio headphones, find your perfect sound.
            </p>
            <div className="hero-buttons">
              <Link to="/shop" className="shop-now-btn">
                <i className="fas fa-shopping-bag"></i>
                Shop Now
              </Link>
              <a href="#products" className="explore-btn">
                <i className="fas fa-arrow-down"></i>
                Explore
              </a>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-glow"></div>
          </div>
        </div>
        <div className="hero-features">
          <div className="feature-item">
            <i className="fas fa-shipping-fast"></i>
            <span>Free Shipping</span>
          </div>
          <div className="feature-item">
            <i className="fas fa-shield-alt"></i>
            <span>1 Year Warranty</span>
          </div>
          <div className="feature-item">
            <i className="fas fa-headset"></i>
            <span>24/7 Support</span>
          </div>
          <div className="feature-item">
            <i className="fas fa-undo"></i>
            <span>Easy Returns</span>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section id="products" className="products-section">
        <div className="section-header">
          <h2 className="section-title">Featured Products</h2>
          <p className="section-subtitle">Discover our curated collection of premium audio gear</p>
        </div>

        {/* Filters and Sort */}
        <div className="products-controls">
          <div className="filter-group">
            <label htmlFor="filter">Filter by Brand:</label>
            <select
              id="filter"
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="filter-select"
            >
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand.charAt(0).toUpperCase() + brand.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="sort-group">
            <label htmlFor="sort">Sort by:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="default">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <i className="fas fa-search"></i>
            <p>No products found. Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((item) => {
              const isInWishlist = wishlist.some((w) => w.id === item.id);
              return (
                <div className="product-card" key={item.id}>
                  <div className="product-image-wrapper">
                    <div className="product-badge">
                      {item.price < item.originalPrice && (
                        <span className="discount-badge">
                          {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                        </span>
                      )}
                    </div>
                    <button
                      className={`wishlist-btn ${isInWishlist ? "active" : ""}`}
                      onClick={() => toggleWishlist(item)}
                      aria-label="Add to wishlist"
                    >
                      <i className={isInWishlist ? "fas fa-heart" : "far fa-heart"}></i>
                    </button>
                    <div className="product-image">
                      <img src={item.img} alt={item.name} />
                    </div>
                  </div>
                  <div className="product-info">
                    <div className="brand-name">{item.brand}</div>
                    <h3 className="product-name">{item.name}</h3>
                    <StarRating rating={item.rating} reviews={item.reviews} />
                    <div className="price-section">
                      <span className="current-price">₹{item.price.toLocaleString()}</span>
                      {item.originalPrice > item.price && (
                        <span className="original-price">₹{item.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                    <div className="product-actions">
                      <button
                        className="add-to-cart-btn"
                        onClick={() => handleAddToCart(item)}
                        disabled={!!recentlyAdded[item.id]}
                      >
                        {recentlyAdded[item.id] ? (
                          <>
                            <i className="fas fa-check"></i>
                            Added
                          </>
                        ) : (
                          <>
                            <i className="fas fa-shopping-cart"></i>
                            Add to Cart
                          </>
                        )}
                      </button>
                      <Link to={`/product/${item.id}`} className="quick-view-btn">
                        <i className="fas fa-eye"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* BANNER */}
      <section className="promo-banner">
        <div className="banner-content">
          <div className="banner-icon">
            <i className="fas fa-fire"></i>
          </div>
          <div className="banner-text">
            <h3>Mega Sale!</h3>
            <p>Up to 30% Off on All Headphones – Limited Time Only!</p>
          </div>
          <Link to="/shop" className="banner-btn">
            Shop Now <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </section>

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
              <li><a href="/shop">Shop</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/about">About</a></li>
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

export default Home;
