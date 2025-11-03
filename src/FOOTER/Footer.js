import React from "react";

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-gray-800 shadow-inner mt-10 py-4 rounded-t-2xl text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
                © {new Date().getFullYear()} Intelligent Enterprise Automation Platform | HR Portal
            </p>
        </footer>
    );
};

export default Footer;
