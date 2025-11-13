import React, { useState, useContext, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import products from "../data/product.js";
import StarRating from "../components/StarRating";
import "../style.css";

// Extended product data with categories
const extendedProducts = products.map((product) => {
  let category = "earbuds"; // default
  const name = product.name.toLowerCase();
  
  if (name.includes("headphone") || name.includes("cloud") || name.includes("q20i")) {
    category = "headphones";
  } else if (name.includes("speaker") || name.includes("flip") || name.includes("soundlink") || name.includes("srs")) {
    category = "speakers";
  }
  
  return {
    ...product,
    category,
    discount: product.originalPrice > product.price 
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0
  };
});

// Add more products for a larger catalog
const allProducts = [
  ...extendedProducts,
  // Speakers
  {
    id: "jbl-flip-6",
    brand: "JBL",
    name: "JBL Flip 6",
    price: 8999,
    originalPrice: 10999,
    img: "/Images/img9.jpg",
    rating: "★★★★★",
    reviews: 678,
    category: "speakers",
    discount: 18
  },
  {
    id: "sony-srs-xb43",
    brand: "Sony",
    name: "Sony SRS-XB43",
    price: 15999,
    originalPrice: 18999,
    img: "/Images/img10.jpg",
    rating: "★★★★★",
    reviews: 456,
    category: "speakers",
    discount: 16
  },
  {
    id: "bose-soundlink-revolve-plus",
    brand: "Bose",
    name: "Bose SoundLink Revolve+",
    price: 22999,
    originalPrice: 25999,
    img: "/Images/img11.jpeg",
    rating: "★★★★★",
    reviews: 789,
    category: "speakers",
    discount: 12
  },
  // More Headphones
  {
    id: "sony-wh-1000xm5",
    brand: "Sony",
    name: "Sony WH-1000XM5",
    price: 28999,
    originalPrice: 32999,
    img: "/Images/image.png",
    rating: "★★★★★",
    reviews: 1234,
    category: "headphones",
    discount: 12
  },
  {
    id: "bose-quietcomfort-45",
    brand: "Bose",
    name: "Bose QuietComfort 45",
    price: 26999,
    originalPrice: 29999,
    img: "/Images/image copy.png",
    rating: "★★★★★",
    reviews: 987,
    category: "headphones",
    discount: 10
  },
  {
    id: "sennheiser-momentum-4",
    brand: "Sennheiser",
    name: "Sennheiser Momentum 4",
    price: 24999,
    originalPrice: 27999,
    img: "/Images/image.png",
    rating: "★★★★★",
    reviews: 654,
    category: "headphones",
    discount: 11
  },
  {
    id: "jbl-tune-760nc",
    brand: "JBL",
    name: "JBL Tune 760NC",
    price: 5999,
    originalPrice: 7999,
    img: "/Images/image copy.png",
    rating: "★★★★☆",
    reviews: 432,
    category: "headphones",
    discount: 25
  },
  // More Earbuds
  {
    id: "samsung-galaxy-buds2-pro",
    brand: "Samsung",
    name: "Samsung Galaxy Buds2 Pro",
    price: 12999,
    originalPrice: 14999,
    img: "/Images/image2.png",
    rating: "★★★★★",
    reviews: 756,
    category: "earbuds",
    discount: 13
  },
  {
    id: "google-pixel-buds-pro",
    brand: "Google",
    name: "Google Pixel Buds Pro",
    price: 14999,
    originalPrice: 16999,
    img: "/Images/image3.png",
    rating: "★★★★★",
    reviews: 543,
    category: "earbuds",
    discount: 12
  },
  {
    id: "jabra-elite-85t",
    brand: "Jabra",
    name: "Jabra Elite 85t",
    price: 16999,
    originalPrice: 18999,
    img: "/Images/image4.png",
    rating: "★★★★★",
    reviews: 678,
    category: "earbuds",
    discount: 11
  },
  {
    id: "beats-fit-pro",
    brand: "Beats",
    name: "Beats Fit Pro",
    price: 17999,
    originalPrice: 19999,
    img: "/Images/image5.png",
    rating: "★★★★★",
    reviews: 890,
    category: "earbuds",
    discount: 10
  },
  {
    id: "sony-wf-1000xm5",
    brand: "Sony",
    name: "Sony WF-1000XM5",
    price: 19999,
    originalPrice: 22999,
    img: "/Images/image6.png",
    rating: "★★★★★",
    reviews: 1123,
    category: "earbuds",
    discount: 13
  },
  {
    id: "bose-quietcomfort-earbuds-ii",
    brand: "Bose",
    name: "Bose QuietComfort Earbuds II",
    price: 21999,
    originalPrice: 24999,
    img: "/Images/image7.png",
    rating: "★★★★★",
    reviews: 765,
    category: "earbuds",
    discount: 12
  },
  {
    id: "anker-soundcore-liberty-4",
    brand: "Soundcore",
    name: "Soundcore Liberty 4",
    price: 8999,
    originalPrice: 10999,
    img: "/Images/image8.png",
    rating: "★★★★☆",
    reviews: 456,
    category: "earbuds",
    discount: 18
  },
  {
    id: "realme-buds-air-5-pro",
    brand: "realme",
    name: "realme Buds Air 5 Pro",
    price: 3999,
    originalPrice: 4999,
    img: "/Images/image2.png",
    rating: "★★★★☆",
    reviews: 234,
    category: "earbuds",
    discount: 20
  },
  // More Speakers
  {
    id: "sonos-move-2",
    brand: "Sonos",
    name: "Sonos Move 2",
    price: 44999,
    originalPrice: 49999,
    img: "/Images/img9.jpg",
    rating: "★★★★★",
    reviews: 567,
    category: "speakers",
    discount: 10
  },
  {
    id: "jbl-charge-5",
    brand: "JBL",
    name: "JBL Charge 5",
    price: 12999,
    originalPrice: 14999,
    img: "/Images/img10.jpg",
    rating: "★★★★★",
    reviews: 789,
    category: "speakers",
    discount: 13
  },
  {
    id: "ultimate-ears-boom-3",
    brand: "Ultimate Ears",
    name: "Ultimate Ears BOOM 3",
    price: 11999,
    originalPrice: 13999,
    img: "/Images/img11.jpeg",
    rating: "★★★★★",
    reviews: 623,
    category: "speakers",
    discount: 14
  },
  {
    id: "marshall-acton-iii",
    brand: "Marshall",
    name: "Marshall Acton III",
    price: 18999,
    originalPrice: 21999,
    img: "/Images/img9.jpg",
    rating: "★★★★★",
    reviews: 445,
    category: "speakers",
    discount: 14
  }
];

const categories = [
  { id: "all", name: "All Products", icon: "fa-th-large", count: allProducts.length },
  { id: "headphones", name: "Headphones", icon: "fa-headphones-alt", count: allProducts.filter(p => p.category === "headphones").length },
  { id: "earbuds", name: "Earbuds", icon: "fa-microphone-alt", count: allProducts.filter(p => p.category === "earbuds").length },
  { id: "speakers", name: "Speakers", icon: "fa-volume-up", count: allProducts.filter(p => p.category === "speakers").length }
];

function Shop() {
  const { cart, addToCart } = useContext(CartContext);
  const { isAuthenticated, user, signOut } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const shopPageRef = useRef(null);

  // Scroll detection for hiding header
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Hide when scrolling down past 200px, show when scrolling up
          if (currentScrollY > 200) {
            if (currentScrollY > lastScrollY) {
              // Scrolling down - hide header
              setIsScrolled(true);
            } else {
              // Scrolling up - show header
              setIsScrolled(false);
            }
          } else {
            // Always show when near top
            setIsScrolled(false);
          }
          
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts.filter((product) => {
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
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
      case "newest":
        // Sort by ID or add a date field
        filtered.reverse();
        break;
      default:
        break;
    }

    return filtered;
  }, [selectedCategory, sortBy, searchQuery]);

  const handleAddToCart = (product) => {
    addToCart(product);
    // Show feedback
    const button = document.querySelector(`[data-product-id="${product.id}"]`);
    if (button) {
      const originalHTML = button.innerHTML;
      button.innerHTML = '<i class="fas fa-check"></i> Added!';
      button.style.background = '#10b981';
      setTimeout(() => {
        button.innerHTML = originalHTML;
        button.style.background = '';
      }, 2000);
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

        {mobileMenuOpen && (
          <div className="mobile-menu">
            <Link to="/" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/about" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link to="/contact" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            <Link to="/shop" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
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

      {/* SHOP PAGE */}
      <div className="shop-page">
        <div className="shop-container">
          {/* Left Sidebar - Categories */}
          <div className="categories-sidebar">
            <h2>
              <i className="fas fa-filter"></i>
              Categories
            </h2>

            {categories.map((category) => (
              <div
                key={category.id}
                className={`category-item ${selectedCategory === category.id ? "active" : ""}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div>
                  <i className={`fas ${category.icon}`}></i>
                  <span>{category.name}</span>
                </div>
                <span className="category-count">{category.count}</span>
              </div>
            ))}
          </div>

          {/* Right Content Area */}
          <div className="products-section" ref={shopPageRef}>
            <div className={`products-header ${isScrolled ? "scrolled-hidden" : ""}`}>
              <div>
                <h1>All Products</h1>
                <p>Discover our complete collection of premium audio gear</p>
              </div>

              <div className="products-controls">
                <div className="sort-dropdown">
                  <select
                    id="sortSelect"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-select"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>

                <div className="view-toggle">
                  <button
                    className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                    onClick={() => setViewMode("grid")}
                    aria-label="Grid view"
                  >
                    <i className="fas fa-th"></i>
                  </button>
                  <button
                    className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                    onClick={() => setViewMode("list")}
                    aria-label="List view"
                  >
                    <i className="fas fa-list"></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="products-count">
              {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? "product" : "products"} found
            </div>

            <div className={`product-grid shop-grid ${viewMode === "list" ? "list-view" : ""}`}>
              {filteredAndSortedProducts.map((product) => (
                <div key={product.id} className="product-card shop-card">
                  <div className="product-image-wrapper shop-image-wrapper">
                    {product.discount > 0 && (
                      <div className="product-badge">
                        <span className="discount-badge">-{product.discount}%</span>
                      </div>
                    )}
                    <div className="product-image">
                      <img src={product.img} alt={product.name} />
                    </div>
                  </div>
                  <div className="product-info shop-product-info">
                    <div className="brand-name">{product.brand}</div>
                    <h3 className="product-name">{product.name}</h3>
                    <StarRating rating={product.rating} reviews={product.reviews} />
                    <div className="price-section">
                      <span className="current-price">₹{product.price.toLocaleString()}</span>
                      {product.originalPrice > product.price && (
                        <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                    <div className="product-actions shop-actions">
                      <button
                        className="add-to-cart-btn shop-add-btn"
                        onClick={() => handleAddToCart(product)}
                        data-product-id={product.id}
                      >
                        <i className="fas fa-shopping-cart"></i>
                        Add to Cart
                      </button>
                      <Link to={`/product/${product.id}`} className="quick-view-btn shop-view-btn">
                        <i className="fas fa-eye"></i>
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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
              <li><Link to="/shop">Shop</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
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

export default Shop;

