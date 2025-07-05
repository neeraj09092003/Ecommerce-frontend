import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";

function Header() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminDropdown, setAdminDropdown] = useState(false);
  const navigate = useNavigate();
  const adminRef = useRef();

  // Close admin dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (adminRef.current && !adminRef.current.contains(event.target)) {
        setAdminDropdown(false);
      }
    };
    if (adminDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [adminDropdown]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="flex justify-between items-center max-w-6xl mx-auto relative">
        <Link to="/" className="text-xl font-bold">
          🛒 E-Shop
        </Link>
        {/* Desktop Menu */}
        <div className="hidden sm:flex gap-4 items-center">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/cart" className="hover:underline">Cart</Link>
          {user && (
            <>
              <Link to="/orders" className="hover:underline">Orders</Link>
              <Link to="/profile" className="hover:underline">Profile</Link>
              {/* Admin Links */}
              {user.isAdmin && (
                <div className="relative" ref={adminRef}>
                  <button
                    className="hover:underline"
                    onClick={() => setAdminDropdown((open) => !open)}
                  >
                    Admin
                  </button>
                  {adminDropdown && (
                    <div className="absolute left-0 mt-2 bg-gray-900 rounded shadow-lg z-50 min-w-[150px]">
                      <Link to="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-700" onClick={() => setAdminDropdown(false)}>Dashboard</Link>
                      <Link to="/admin/products" className="block px-4 py-2 hover:bg-gray-700" onClick={() => setAdminDropdown(false)}>Products</Link>
                      <Link to="/admin/orders" className="block px-4 py-2 hover:bg-gray-700" onClick={() => setAdminDropdown(false)}>Orders</Link>
                      <Link to="/admin/users" className="block px-4 py-2 hover:bg-gray-700" onClick={() => setAdminDropdown(false)}>Users</Link>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded ml-2"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="hover:underline">Login</Link>
          )}
        </div>
        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-16 left-0 w-full bg-gray-800 flex flex-col gap-2 items-center py-4 sm:hidden z-50 shadow-lg">
            <Link to="/" className="hover:underline py-1" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/cart" className="hover:underline py-1" onClick={() => setMenuOpen(false)}>Cart</Link>
            {user && (
              <>
                <Link to="/orders" className="hover:underline py-1" onClick={() => setMenuOpen(false)}>Orders</Link>
                <Link to="/profile" className="hover:underline py-1" onClick={() => setMenuOpen(false)}>Profile</Link>
                {/* Admin Links for Mobile */}
                {user.isAdmin && (
                  <>
                    <Link to="/admin/dashboard" className="hover:underline py-1" onClick={() => setMenuOpen(false)}>Admin Dashboard</Link>
                    <Link to="/admin/products" className="hover:underline py-1" onClick={() => setMenuOpen(false)}>Admin Products</Link>
                    <Link to="/admin/orders" className="hover:underline py-1" onClick={() => setMenuOpen(false)}>Admin Orders</Link>
                    <Link to="/admin/users" className="hover:underline py-1" onClick={() => setMenuOpen(false)}>Admin Users</Link>
                  </>
                )}
              </>
            )}
            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="bg-red-500 px-3 py-1 rounded mt-2"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="hover:underline py-1" onClick={() => setMenuOpen(false)}>Login</Link>
            )}
          </div>
        )}
        {/* Hamburger for mobile */}
        <button
          className="sm:hidden ml-2"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </nav>
    </header>
  );
}

export default Header;