// File: src/pages/HomePage.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import image from "./Avatar.png";
import Nav from "../Navigation/Navigate";
import About from "./About";
import Feature from "./Feature";
//import { Feather } from "lucide-react";
import Contact from "./Contact";

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





export default function HomePage() {
    const [userDetails, setUserDetails] = useState(undefined);
    const [mainUser, setMainUser] = useState(undefined);
    const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const getUserDetails = async (d_id) => {
        const response = await fetch("https://servercomplients.onrender.com/api/user-details", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: d_id }),
        });

        const data = await response.json();
        if (response.ok) {
            console.log(data);
            setMainUser(data.userDetails);
            setUserDetails(data.userDetails);
        }
    };

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                getUserDetails(decoded.id);
            } catch (error) {
                console.error("Invalid token:", error);
            }
        }
    }, []);

    return (
        <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800 dark:from-gray-950 dark:to-gray-900 dark:text-gray-100 transition-colors duration-500">
            <Nav
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                mainUser={mainUser}
                userDetails={userDetails}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            {/* Main Page Content */}
            <main
                className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"
                    }`}
            >
                {/* Hero Section */}
                <section className="flex flex-col md:flex-row items-center justify-between px-10 md:px-20 py-20 md:py-28">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex-1"
                    >
                        <h2 className="text-5xl md:text-6xl font-extrabold leading-tight text-blue-800 dark:text-blue-400">
                            Manage. Analyze.{" "}
                            <span className="text-blue-500 dark:text-blue-300">Resolve.</span>
                        </h2>
                        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-xl">
                            Empowering customer service teams to manage financial grievances efficiently using real-time insights and intelligent data analytics.
                        </p>
                        <div className="mt-10 flex flex-wrap gap-4">
                            <Button className="shadow-lg">Get Started</Button>
                            <Button variant="outline">Learn More</Button>
                        </div>
                    </motion.div>

                    {/* Hero Image */}
                    <motion.div
                        className="flex-1 flex justify-center mt-12 md:mt-0"
                        key={darkMode ? "dark" : "light"}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <img
                            src={image}
                            alt="Grievance Management"
                            className="w-full max-w-md md:max-w-lg rounded-xl drop-shadow-xl"
                        />
                    </motion.div>
                </section>
                <Feature />

                <About />
                <Contact />
                {/* Footer */}
                <footer className="bg-blue-900 dark:bg-gray-950 text-white py-6 text-center border-t border-blue-700 dark:border-gray-800 transition-colors duration-500 mt-auto">
                    <p className="text-sm opacity-90">
                        © {new Date().getFullYear()} Grievance Grabber. All rights reserved.
                    </p>
                </footer>
            </main>
        </div>
    );
}
