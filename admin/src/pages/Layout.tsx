import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../sections/Sidebar";

interface LayoutProps {
  children?: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar isOpen={isSidebarOpen} onToggle={handleToggleSidebar} />
      <main
        className={`transition-all duration-300 flex-1 p-6 ${
          isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        {children || <Outlet />}
      </main>
    </div>
  );
}

export default Layout;
