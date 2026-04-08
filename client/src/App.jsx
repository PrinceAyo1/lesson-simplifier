import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import GeneratorPage from "./pages/GeneratorPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app/generate" element={<GeneratorPage />} />
    </Routes>
  );
}

export default App;
