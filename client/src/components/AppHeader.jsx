import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import "./AppHeader.css";

export default function AppHeader() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link to="/" className="app-header__brand">
          Topic Simplifier
        </Link>

        <nav className="app-header__nav">
          <Link to="/app/generate">Generate</Link>
          <Link to="/app/saved">Saved Lessons</Link>
        </nav>

        <button className="app-header__logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
