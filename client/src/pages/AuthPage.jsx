import { useState } from "react";
import { supabase } from "../services/supabase";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    try {
      setLoading(true);

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        window.location.href = "/app/generate";
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        window.location.href = "/app/generate";
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: "1rem", padding: "0.8rem" }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: "1rem", padding: "0.8rem" }}
      />

      <button onClick={handleAuth} disabled={loading}>
        {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
      </button>

      <p style={{ marginTop: "1rem", cursor: "pointer" }}>
        {isLogin ? "No account? Sign up" : "Already have an account? Login"}
      </p>

      <button onClick={() => setIsLogin(!isLogin)}>
        Switch to {isLogin ? "Sign Up" : "Login"}
      </button>
    </main>
  );
}
