import React, { useContext, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import products from "../data/product.js";
import StarRating from "../components/StarRating";
import "../style.css";

// Enhanced product data with descriptions and specs
const productDetails = {
  "hyperx-cloud-iii": {
    description: "Experience premium gaming audio with the HyperX Cloud III. Featuring advanced 53mm drivers, memory foam ear cushions, and a durable aluminum frame, these headphones deliver exceptional sound quality and comfort for extended gaming sessions.",
    features: [
      "53mm Drivers for Superior Sound",
      "Memory Foam Ear Cushions",
      "Durable Aluminum Frame",
      "Noise-Cancelling Microphone",
      "Multi-Platform Compatibility"
    ],
    specifications: {
      "Driver Size": "53mm",
      "Frequency Response": "10Hz - 21kHz",
      "Impedance": "60Ω",
      "Weight": "320g",
      "Cable Length": "1.3m",
      "Compatibility": "PC, PS4, PS5, Xbox, Mobile"
    }
  },
  "oppo-enco-air3-pro": {
    description: "The OPPO Enco Air3 Pro delivers exceptional audio quality with active noise cancellation, long battery life, and a comfortable fit. Perfect for music lovers and professionals on the go.",
    features: [
      "Active Noise Cancellation",
      "30-Hour Battery Life",
      "Fast Charging (10 min = 7 hours)",
      "IPX5 Water Resistance",
      "Touch Controls"
    ],
    specifications: {
      "Driver Size": "12.4mm",
      "Battery Life": "30 hours (with case)",
      "Charging": "USB-C, Wireless",
      "Weight": "4.8g per earbud",
      "Water Resistance": "IPX5",
      "Bluetooth": "5.2"
    }
  },
  "oneplus-nord-buds-3-pro": {
    description: "Premium wireless earbuds with crystal-clear sound and all-day comfort. Features advanced noise cancellation and seamless connectivity.",
    features: [
      "Active Noise Cancellation",
      "12.4mm Dynamic Drivers",
      "Fast Pair Technology",
      "IP55 Water Resistance",
      "Up to 30 Hours Playback"
    ],
    specifications: {
      "Driver Size": "12.4mm",
      "Battery Life": "30 hours",
      "Charging": "USB-C",
      "Weight": "4.7g per earbud",
      "Water Resistance": "IP55",
      "Bluetooth": "5.3"
    }
  },
  "cmf-nothing-earbuds": {
    description: "Sleek design meets powerful performance. The CMF by Nothing earbuds offer exceptional sound quality with a minimalist aesthetic.",
    features: [
      "11.6mm Dynamic Drivers",
      "Clear Voice Technology",
      "IP54 Water Resistance",
      "Fast Charging",
      "Touch Controls"
    ],
    specifications: {
      "Driver Size": "11.6mm",
      "Battery Life": "33 hours",
      "Charging": "USB-C",
      "Weight": "4.5g per earbud",
      "Water Resistance": "IP54",
      "Bluetooth": "5.2"
    }
  },
  "soundcore-anker-q20i": {
    description: "Professional-grade over-ear headphones with hybrid active noise cancellation. Perfect for travel, work, and immersive listening experiences.",
    features: [
      "Hybrid Active Noise Cancellation",
      "40mm Drivers",
      "40-Hour Battery Life",
      "Memory Foam Ear Cups",
      "Foldable Design"
    ],
    specifications: {
      "Driver Size": "40mm",
      "Battery Life": "40 hours (ANC off)",
      "Charging": "USB-C",
      "Weight": "260g",
      "Noise Cancellation": "Hybrid ANC",
      "Bluetooth": "5.0"
    }
  },
  "mivi-superpods-immersio": {
    description: "Affordable wireless earbuds with impressive sound quality and long battery life. Great value for everyday use.",
    features: [
      "10mm Dynamic Drivers",
      "30-Hour Total Playback",
      "IPX5 Water Resistance",
      "Touch Controls",
      "Fast Charging"
    ],
    specifications: {
      "Driver Size": "10mm",
      "Battery Life": "30 hours",
      "Charging": "USB-C",
      "Weight": "4.2g per earbud",
      "Water Resistance": "IPX5",
      "Bluetooth": "5.1"
    }
  },
  "apple-airpods-4": {
    description: "The latest generation of Apple's iconic AirPods. Featuring spatial audio, adaptive EQ, and seamless integration with Apple devices.",
    features: [
      "Spatial Audio with Dynamic Head Tracking",
      "Adaptive EQ",
      "Active Noise Cancellation",
      "MagSafe Charging Case",
      "Sweat and Water Resistant"
    ],
    specifications: {
      "Driver Size": "Custom High-Excursion",
      "Battery Life": "30 hours (with case)",
      "Charging": "Lightning, MagSafe, Qi",
      "Weight": "5.4g per earbud",
      "Water Resistance": "IPX4",
      "Bluetooth": "5.3"
    }
  },
  "marshall-minor-iv": {
    description: "True wireless earbuds with Marshall's signature sound. Rock-inspired design meets modern technology for an unparalleled audio experience.",
    features: [
      "Marshall Signature Sound",
      "Active Noise Cancellation",
      "25-Hour Battery Life",
      "IPX5 Water Resistance",
      "Touch Controls"
    ],
    specifications: {
      "Driver Size": "6mm",
      "Battery Life": "25 hours",
      "Charging": "USB-C",
      "Weight": "4.5g per earbud",
      "Water Resistance": "IPX5",
      "Bluetooth": "5.2"
    }
  }
};

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart } = useContext(CartContext);
  const { isAuthenticated, user, signOut } = useContext(AuthContext);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  const product = products.find((p) => p.id === id);
  const details = productDetails[id] || {};

  // Get related products (same brand, excluding current)
  const relatedProducts = products
    .filter((p) => p.brand === product?.brand && p.id !== id)
    .slice(0, 4);

  useEffect(() => {
    if (!product) {
      navigate("/");
    }
  }, [product, navigate]);

  if (!product) {
    return null;
  }

  const isInWishlist = wishlist.some((w) => w.id === product.id);

  const toggleWishlist = () => {
    setWishlist((prev) => {
      const isInWishlist = prev.some((item) => item.id === product.id);
      const newWishlist = isInWishlist
        ? prev.filter((item) => item.id !== product.id)
        : [...prev, product];
      localStorage.setItem("wishlist", JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    // Show success message (you can add toast notification here)
  };

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

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

      {/* BREADCRUMBS */}
      <div className="breadcrumbs">
        <div className="breadcrumbs-container">
          <Link to="/" className="breadcrumb-link">
            <i className="fas fa-home"></i> Home
          </Link>
          <span className="breadcrumb-separator">/</span>
          <Link to="/" className="breadcrumb-link">Products</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{product.name}</span>
        </div>
      </div>

      {/* PRODUCT DETAIL PAGE */}
      <div className="product-detail-page">
        <div className="product-detail-container">
          {/* Product Images */}
          <div className="product-images-section">
            <div className="main-product-image">
              <img src={product.img} alt={product.name} />
              {discount > 0 && (
                <div className="product-detail-badge">
                  <span className="discount-badge-large">{discount}% OFF</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info-section">
            <div className="product-brand">{product.brand}</div>
            <h1 className="product-detail-title">{product.name}</h1>
            
            <div className="product-detail-rating">
              <StarRating rating={product.rating} reviews={product.reviews} />
            </div>

            <div className="product-detail-price-section">
              <span className="product-detail-price">₹{product.price.toLocaleString()}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="product-detail-original-price">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="product-detail-savings">
                    You save ₹{(product.originalPrice - product.price).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            <div className="product-detail-description">
              <p>{details.description || "Premium quality audio product designed for exceptional sound experience."}</p>
            </div>

            {/* Features */}
            {details.features && (
              <div className="product-features">
                <h3>Key Features</h3>
                <ul>
                  {details.features.map((feature, index) => (
                    <li key={index}>
                      <i className="fas fa-check-circle"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="product-actions-section">
              <div className="quantity-selector">
                <label>Quantity:</label>
                <div className="quantity-controls-large">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="quantity-btn-large"
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <span className="quantity-value-large">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="quantity-btn-large"
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>

              <div className="product-action-buttons">
                <button className="add-to-cart-btn-large" onClick={handleAddToCart}>
                  <i className="fas fa-shopping-cart"></i>
                  Add to Cart
                </button>
                <button
                  className={`wishlist-btn-large ${isInWishlist ? "active" : ""}`}
                  onClick={toggleWishlist}
                >
                  <i className={isInWishlist ? "fas fa-heart" : "far fa-heart"}></i>
                  {isInWishlist ? "Saved" : "Save"}
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="product-info-cards">
              <div className="info-card">
                <i className="fas fa-shipping-fast"></i>
                <div>
                  <strong>Free Shipping</strong>
                  <p>On orders over ₹5,000</p>
                </div>
              </div>
              <div className="info-card">
                <i className="fas fa-undo"></i>
                <div>
                  <strong>Easy Returns</strong>
                  <p>30-day return policy</p>
                </div>
              </div>
              <div className="info-card">
                <i className="fas fa-shield-alt"></i>
                <div>
                  <strong>Warranty</strong>
                  <p>1 year manufacturer warranty</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications & Details */}
        {details.specifications && (
          <div className="product-specifications">
            <h2>Specifications</h2>
            <div className="specs-grid">
              {Object.entries(details.specifications).map(([key, value]) => (
                <div key={key} className="spec-item">
                  <span className="spec-label">{key}</span>
                  <span className="spec-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="related-products-section">
            <h2>Related Products</h2>
            <div className="related-products-grid">
              {relatedProducts.map((item) => (
                <Link to={`/product/${item.id}`} key={item.id} className="related-product-card">
                  <div className="related-product-image">
                    <img src={item.img} alt={item.name} />
                  </div>
                  <div className="related-product-info">
                    <div className="related-product-brand">{item.brand}</div>
                    <h3>{item.name}</h3>
                    <StarRating rating={item.rating} reviews={item.reviews} />
                    <div className="related-product-price">
                      <span className="current-price">₹{item.price.toLocaleString()}</span>
                      {item.originalPrice > item.price && (
                        <span className="original-price">₹{item.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ProductDetail;

