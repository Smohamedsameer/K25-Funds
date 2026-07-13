import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Purpose from "./pages/Purpose.jsx";
import Gallery from "./pages/Gallery.jsx";
import Login from "./pages/Login.jsx";
import K25Auth from "./pages/K25Auth.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import TopBanner from "./components/TopBanner.jsx";
import Footer from "./components/Footer.jsx";
import { MenuProvider } from "./components/MenuContext.jsx";

// Dashboards have their own minimal header — public Navbar only shows elsewhere.
const NO_NAVBAR_ROUTES = ["/dashboard", "/admin"];

function Shell() {
  const location = useLocation();
  const hideNavbar = NO_NAVBAR_ROUTES.includes(location.pathname);
  return (
    <>
<MenuProvider>
  <TopBanner />
  <Navbar />
  {/* rest of your app */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/purpose" element={<Purpose />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/login" element={<Login />} />
        <Route path="/k25" element={<K25Auth />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      <Footer/>
</MenuProvider>
   
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}
