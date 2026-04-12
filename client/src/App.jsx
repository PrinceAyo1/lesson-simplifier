import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import GeneratorPage from "./pages/GeneratorPage";
import AuthPage from "./pages/AuthPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app/generate" element={<GeneratorPage />} />
      <Route path="/auth" element={<AuthPage />} />
    </Routes>
  );
}

export default App;
