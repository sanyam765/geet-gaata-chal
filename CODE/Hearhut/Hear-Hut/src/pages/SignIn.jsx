import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../style.css";

function SignIn() {
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isGmailEmail = (email) => {
    const gmailRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/i;
    return gmailRegex.test(String(email || "").trim());
  };

  const isValidPassword = (password) => {
    const pwd = String(password || "");
    const noSpaces = /^\S+$/;
    const twoUppercase = /(?:.*[A-Z]){2,}/;
    const oneSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
    return noSpaces.test(pwd) && twoUppercase.test(pwd) && oneSpecial.test(pwd);
  };

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!isGmailEmail(form.email)) {
        throw new Error("Email must be a valid @gmail.com address");
      }
      if (!isValidPassword(form.password)) {
        throw new Error(
          "Password must have 2 uppercase letters, 1 special character, and no spaces"
        );
      }
      await signIn(form);
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "92vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 370,
          background: "var(--card-bg, #fff)",
          borderRadius: 18,
          boxShadow: "0 8px 32px rgba(0,0,0,.10)",
          padding: 32,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Logo/Site Title */}
        <div style={{ fontWeight: 800, fontSize: 28, marginBottom: 6, letterSpacing: "-1px", color: "var(--accent)", textAlign: "center" }}>
          Hear<span style={{ color: "var(--primary-color)" }}>Hut</span>
        </div>
        <div style={{ color: "var(--text-muted)", fontSize: 15, marginBottom: 22, textAlign: "center" }}>Sign in to your account</div>
        <form className="contact-form" style={{ width: "100%", marginBottom: 8 }} onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              required
              autoFocus
              autoComplete="email"
            />
          </div>
          <div className="form-group" style={{ position: "relative" }}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={onChange}
              required
              autoComplete="current-password"
              style={{ paddingRight: 46 }}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((v) => !v)}
              style={
                {
                  position: "absolute",
                  right: 7,
                  top: 35,
                  background: "none",
                  border: "none",
                  padding: 0,
                  color: "#888",
                  cursor: "pointer",
                  fontSize: 18,
                }
              }
              tabIndex={-1}
            >
              <i className={`fas fa-eye${showPassword ? "-slash" : ""}`}></i>
            </button>
          </div>
          {error && (
            <div className="form-error" style={{ marginBottom: 10, marginTop: 2 }}>
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}
          <button
            className="submit-btn"
            style={{ width: "100%", marginBottom: 12, marginTop: 8 }}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Signing In...
              </>
            ) : (
              <>Sign In</>
            )}
          </button>
        </form>
        <div style={{ fontSize: 15, color: "var(--text-muted)", marginTop: 3, textAlign: "center" }}>
          New here?{' '}
          <Link
            to="/signup"
            style={{ color: "var(--accent)", fontWeight: 600, textDecoration: 'underline', paddingLeft: 2 }}
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignIn;


