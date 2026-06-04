import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import "./AppHeader.css";

export default function AppHeader() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user || null);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/auth", { replace: true });
  };

  return (
    <>
      <header className="app-header">
        <div className="app-header__inner">
          <Link to="/" className="app-header__brand">
            Topic Simplifier
          </Link>

          <nav className="app-header__nav">
            <Link to="/app/generate">Generate</Link>
            <Link to="/app/saved">Saved Lessons</Link>
          </nav>

          {user ? (
            <button className="app-header__logout" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button
              className="app-header__logout"
              onClick={() => navigate("/auth")}
            >
              Login
            </button>
          )}
        </div>
      </header>

      <nav className="mobile-bottom-nav">
        <Link to="/">Home</Link>
        <Link to="/app/generate">Generate</Link>
        <Link to="/app/saved">Saved</Link>
      </nav>
    </>
  );
}
