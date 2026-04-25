import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import GeneratorPage from "./pages/GeneratorPage";
import AuthPage from "./pages/AuthPage";
import SavedLessonsPage from "./pages/SavedLessonsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/app/generate" element={<GeneratorPage />} />
      <Route path="/app/saved" element={<SavedLessonsPage />} />
    </Routes>
  );
}

export default App;
