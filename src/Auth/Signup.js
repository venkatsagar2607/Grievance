import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Icons for the theme toggle
const sunIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 12a5 5 0 100-10 5 5 0 000 10z" />
    </svg>
);

const moonIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

function Signup() {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // ✅ Email Validation
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // ✅ Strong Password Validation
    const validatePassword = (password) => {
        // Minimum 8 chars, at least one uppercase, one lowercase, one number, one special char
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Frontend Validations
        if (!validateEmail(formData.email)) {
            toast.error("Please enter a valid email address!", { position: "top-right" });
            return;
        }

        if (!validatePassword(formData.password)) {
            toast.error("Password must be at least 8 characters, include uppercase, lowercase, number, and special character!", {
                position: "top-right",
            });
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords don't match!", { position: "top-right" });
            return;
        }

        try {
            const response = await fetch('https://servercomplients.onrender.com/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });
            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || 'Registration successful', {
                    position: 'top-right',
                    autoClose: 3000,
                    style: { fontFamily: "'Noto Sans', sans-serif" },
                });
            } else {
                // ✅ Show backend error like "User already exists"
                toast.error(data.message || 'Registration failed', {
                    position: 'top-right',
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Could not register user', { position: "top-right" });
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 transition-colors duration-300 dark:bg-gray-900">
            <div className="relative w-full max-w-md rounded-xl bg-white p-8 shadow-2xl transition-colors duration-300 dark:bg-gray-800">
                <button
                    onClick={toggleTheme}
                    className="absolute top-4 right-4 rounded-full p-2 text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                    {theme === 'light' ? moonIcon : sunIcon}
                </button>

                <h2 className="mb-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
                    Create Account
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Name
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Password
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Re-enter Password
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <button
                        type="submit"
                        className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    >
                        Sign Up
                    </button>

                    <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link to="/Signin" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                            Sign In
                        </Link>
                    </p>
                </form>
            </div>

            {/* ✅ Toast Container */}
            <ToastContainer />

        </div>
    );
}

export default Signup;
