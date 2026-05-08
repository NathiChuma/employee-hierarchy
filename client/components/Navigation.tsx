import { Link, useLocation } from "react-router-dom";
import { Users, GitBranch, Home, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDarkMode } from "@/hooks/useDarkMode";

export default function Navigation() {
  const location = useLocation();
  const { isDark, toggle } = useDarkMode();

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/employees", label: "Employees", icon: Users },
    { href: "/hierarchy", label: "Hierarchy", icon: GitBranch },
  ];

  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 transition-colors">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white">
            <div className="p-2 rounded-lg bg-primary text-white">
              <Users className="h-5 w-5" />
            </div>
            <span className="hidden sm:inline">EPI-USE Africa</span>
          </Link>

          {/* Navigation Links and Dark Mode Toggle */}
          <div className="flex items-center gap-4">
            <nav className="flex gap-1">
              {links.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  to={href}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2",
                    location.pathname === href
                      ? "bg-primary text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              ))}
            </nav>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
