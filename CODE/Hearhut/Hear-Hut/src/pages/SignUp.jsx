import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../style.css";

function SignUp() {
  const { signUp } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    setSuccess("");
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
      await signUp(form);
      setSuccess("Account created! Please sign in.");
      setTimeout(() => {
        navigate("/signin");
      }, 1200);
    } catch (err) {
      setError(err.message || "Failed to sign up");
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
        <div style={{ color: "var(--text-muted)", fontSize: 15, marginBottom: 22, textAlign: "center" }}>Create your account</div>
        <form className="contact-form" style={{ width: "100%", marginBottom: 8 }} onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input id="name" name="name" type="text" value={form.name} onChange={onChange} required autoFocus autoComplete="name" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={form.email} onChange={onChange} required autoComplete="email" />
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
              autoComplete="new-password"
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
          {success && (
            <div className="form-success" style={{ marginBottom: 10, marginTop: 2 }}>
              <i className="fas fa-check-circle"></i>
              {success}
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
                <i className="fas fa-spinner fa-spin"></i> Creating Account...
              </>
            ) : (
              <>Create Account</>
            )}
          </button>
        </form>
        <div style={{ fontSize: 15, color: "var(--text-muted)", marginTop: 3, textAlign: "center" }}>
          Already have an account?{' '}
          <Link
            to="/signin"
            style={{ color: "var(--accent)", fontWeight: 600, textDecoration: 'underline', paddingLeft: 2 }}
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;


