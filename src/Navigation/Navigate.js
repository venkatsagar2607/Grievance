import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Menu,
    LayoutDashboard,
    BarChart3,
    FileText,
    MessageSquare,
    LogOut,
    Sun,
    Moon,
    Home
} from "lucide-react";

export default function Nav({
    darkMode,
    setDarkMode,
    mainUser,
    userDetails,
    sidebarOpen,
    setSidebarOpen,
}) {
    const navigate = useNavigate();

    // ✅ Ensure dark mode applies properly
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    const Button = ({ children, className = "", variant = "solid", ...props }) => {
        const base =
            "px-6 py-2.5 rounded-xl font-semibold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-blue-600";
        const styles =
            variant === "outline"
                ? "border border-blue-600 text-blue-700 hover:bg-blue-50 dark:border-blue-300 dark:text-blue-200 dark:hover:bg-blue-800"
                : "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600";
        return (
            <button className={`${base} ${styles} ${className}`} {...props}>
                {children}
            </button>
        );
    };

    // ✅ Fix icon visibility when collapsed
    const NavLink = ({ href, icon: Icon, label }) => (
        <a
            href={href}
            className={`flex items-center ${sidebarOpen ? "justify-start space-x-3 px-4" : "justify-center"} 
                py-3 rounded-lg text-gray-700 dark:text-gray-300 
                hover:bg-blue-100 dark:hover:bg-gray-800 font-medium transition-all`}
        >
            <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
            {sidebarOpen && <span>{label}</span>}
        </a>
    );

    return (
        <aside
            className={`${sidebarOpen ? "w-64" : "w-20"}
                fixed top-0 left-0 h-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg 
                border-r border-blue-100 dark:border-gray-800 flex flex-col p-6 z-30 
                transition-all duration-300`}
        >
            {/* Header with toggle */}
            <div className="flex items-center justify-between mb-10 px-2">
                {sidebarOpen && (
                    <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-400 tracking-tight">
                        Grievance Grabber
                    </h1>
                )}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition"
                >
                    <Menu className="w-5 h-5" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col space-y-2">
                <NavLink href="/" icon={Home} label="Home" />
                <NavLink href="/Dashboard" icon={LayoutDashboard} label="Dashboard" />
                <NavLink href="/#features" icon={BarChart3} label="Features" />
                <NavLink href="/#about" icon={FileText} label="About" />
                <NavLink href="/#Contact" icon={MessageSquare} label="Contact" />
            </nav>

            {/* Login / Logout */}
            <div className="mb-6">
                {mainUser ? (
                    <button
                        className={`flex items-center ${sidebarOpen ? "justify-start gap-3 px-4" : "justify-center"} 
                            w-full text-red-500 hover:bg-red-50 dark:hover:bg-gray-800 
                            rounded-lg p-3 transition mb-3`}
                        onClick={() => {
                            sessionStorage.removeItem("token");
                            navigate("/Signin");
                        }}
                    >
                        <LogOut className="w-5 h-5" />
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                ) : (
                    sidebarOpen && (
                        <Button className="w-full" onClick={() => navigate("/Signin")}>
                            Login
                        </Button>
                    )
                )}
            </div>

            {/* Footer: Avatar + Theme Toggle */}
            <div
                className={`flex items-center justify-between p-3 bg-blue-50 dark:bg-gray-800 rounded-xl 
                    ${!sidebarOpen && "flex-col gap-2"}`}
            >
                <div className="flex items-center space-x-3">
                    <Link to="/Profile">
                        <div className="font-semibold text-sm text-blue-800 dark:text-blue-300 w-8 h-8 
                            flex items-center justify-center rounded-full bg-blue-500 dark:bg-blue-700 text-white">
                            {mainUser ? mainUser.name.charAt(0).toUpperCase() : "?"}
                        </div>
                    </Link>

                    {sidebarOpen && (
                        <span className="font-semibold text-sm text-blue-800 dark:text-blue-300">
                            Welcome, {mainUser ? mainUser.name : "Guest"}
                        </span>
                    )}
                </div>

                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-gray-700 text-gray-700 dark:text-yellow-400 transition"
                    aria-label="Toggle Dark Mode"
                >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
            </div>
        </aside>
    );
}
