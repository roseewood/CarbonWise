import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import Calculator from "./pages/Audit";
import CoachPage from "./pages/CoachPage";
import AccountPage from "./pages/AccountPage";

function FrameWrapper() {
  const location = useLocation();

  //  Routes where frame should appear
  const framedRoutes = ["/", "/calculator", "/coach", "/account"];

  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/coach" element={<CoachPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Routes>
      </main>

      {/*  This will show frame on selected routes */}
      {framedRoutes.includes(location.pathname) && (
        <div className="page-frame"></div>
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <FrameWrapper />
      </div>
    </Router>
  );
}

export default App;
