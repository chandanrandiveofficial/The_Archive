import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const SIDEBAR_WIDTH = "w-2";

const AdminLayout = () => {
  const token = localStorage.getItem('token');
  
  // Check if token is malformed
  const isTokenValid = () => {
    if (!token) return false;
    try {
      // Basic JWT format check (should have 3 parts separated by dots)
      const parts = token.split('.');
      return parts.length === 3;
    } catch {
      return false;
    }
  };
  
  // Clear malformed token and redirect to login
  if (token && !isTokenValid()) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/admin/login" replace />;
  }
  
  // Redirect to login if not authenticated
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-zinc-100">
      {/* FIXED SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 h-screen ${SIDEBAR_WIDTH} bg-white border-r border-zinc-200 z-50`}
      >
        <Sidebar />
      </aside>

      {/* MAIN CONTENT */}
      <main
        className={`ml-2 sm:ml-64 min-h-screen p-2 pt-16 overflow-y-auto`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
