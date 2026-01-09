import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiGrid,
  FiBox,
  FiShoppingCart,
  FiUsers,
  FiSettings,
  FiFileText,
  FiLogOut,
  FiLock,
  FiUser
} from "react-icons/fi";

const menuItems = [
  { label: "Product Management", icon: FiBox, path: "/admin/" },
  { label: "More Page", icon: FiFileText, path: "/admin/morepage" },
  { label: "Footer Settings", icon: FiSettings, path: "/admin/footer" },
  { label: "Change Password", icon: FiLock, path: "/admin/profile" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getUserData = () => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : {};
    } catch {
      return {};
    }
  };

  const user = getUserData();

  const handleNavigation = (path) => {
    navigate(path);
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  const getInitials = (name) => {
    if (!name) return 'AD';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white z-40 flex items-center px-4">
        <button onClick={() => setOpen(true)}>
          <FiMenu className="text-xl" />
        </button>
        <h2 className="ml-4 text-sm font-semibold">The Archive Admin</h2>
      </div>

      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-white z-50
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-black">
            The Archive
          </h2>
          <p className="text-xs text-gray-500">Admin Panel</p>
        </div>

        {/* MENU */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition
                  ${isActive
                    ? "bg-black text-white"
                    : "text-zinc-600 hover:bg-zinc-100"
                  }`}
                onClick={() => handleNavigation(item.path)}
              >
                <Icon className="text-lg" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* USER & LOGOUT */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3 p-2">
            <div className="h-10 w-10 rounded-full bg-black flex items-center justify-center text-sm font-semibold text-white">
              {getInitials(user.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-black truncate">
                {user.name || 'Admin'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user.email || 'admin@archive.com'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition"
          >
            <FiLogOut className="text-lg" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
