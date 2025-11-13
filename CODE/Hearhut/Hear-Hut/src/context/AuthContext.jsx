import React, { createContext, useEffect, useMemo, useState } from "react";

export const AuthContext = createContext();

function pushAuthEvent(event) {
  try {
    const prev = JSON.parse(localStorage.getItem('auth_events') || '[]');
    prev.push(event);
    while (prev.length > 100) prev.shift();
    localStorage.setItem('auth_events', JSON.stringify(prev));
  } catch {}
}

function isValidPassword(password) {
  const pwd = String(password || "");
  const noSpaces = /^\S+$/;
  const twoUppercase = /(?:.*[A-Z]){2,}/;
  const oneSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
  return noSpaces.test(pwd) && twoUppercase.test(pwd) && oneSpecial.test(pwd);
}

function isGmailEmail(email) {
  const gmailRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/i;
  return gmailRegex.test(String(email || "").trim());
}

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem("users") || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("auth_user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("auth_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("auth_user");
    }
  }, [user]);

  const isAuthenticated = !!user;

  const signIn = async ({ email, password }) => {
    // Realistic auth: lookup user and check password
    if (!email || !password) throw new Error("Email and password required");
    if (!isGmailEmail(email)) throw new Error("Email must be a valid @gmail.com address");
    if (!isValidPassword(password)) {
      throw new Error("Password must have 2 uppercase letters, 1 special character, and no spaces");
    }
    const users = loadUsers();
    const found = users.find(u => u.email === email);
    if (!found) throw new Error("User not found");
    if (found.password !== password) {
      throw new Error("Incorrect password");
    }
    setUser({ email: found.email, name: found.name });
    pushAuthEvent({ type: 'signIn', email, time: new Date().toISOString() });
  };

  const signUp = async ({ name, email, password }) => {
    if (!name || !email || !password)
      throw new Error("All fields required");
    if (!isGmailEmail(email)) throw new Error("Email must be a valid @gmail.com address");
    if (!isValidPassword(password)) {
      throw new Error("Password must have 2 uppercase letters, 1 special character, and no spaces");
    }
    let users = loadUsers();
    if (users.some(u => u.email === email)) {
      throw new Error("Account already exists with this email");
    }
    users.push({ email, name, password });
    saveUsers(users);
    setUser({ email, name });
    pushAuthEvent({ type: 'signUp', email, name, time: new Date().toISOString() });
  };

  const signOut = () => {
    const email = user?.email || null;
    setUser(null);
    if (email) pushAuthEvent({ type: 'signOut', email, time: new Date().toISOString() });
  };

  const value = useMemo(
    () => ({ user, isAuthenticated, signIn, signUp, signOut }),
    [user, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


