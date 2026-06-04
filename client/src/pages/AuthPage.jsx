import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import "./AuthPage.css";

export default function AuthPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const showMessage = (type, text) => {
    setMessage({ type, text });
  };

  const handleAuth = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        navigate("/app/generate");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        showMessage("success", "Account created. You can now log in.");

        setIsLogin(true);
      }
    } catch (error) {
      showMessage("error", error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="auth-subtitle">Topic Simplifier</p>

        <h1 className="auth-title">
          {isLogin ? "Welcome back" : "Create your account"}
        </h1>

        <p className="auth-subtitle">
          {isLogin
            ? "Log in to save topics, revisit explanations, and export your learning materials."
            : "Sign up to save generated topics and build your own revision library."}
        </p>

        {message.text && (
          <div className={`auth-message ${message.type}`}>{message.text}</div>
        )}

        <form onSubmit={handleAuth}>
          <input
            className="auth-input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="auth-button" disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className="auth-switch">
          {isLogin ? "No account yet?" : "Already have an account?"}{" "}
          <button type="button" onClick={() => setIsLogin((prev) => !prev)}>
            {isLogin ? "Sign up" : "Login"}
          </button>
        </div>
      </section>
    </main>
  );
}
