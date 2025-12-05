import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import "react-toastify/dist/ReactToastify.css";

// icons same as before...
// sunIcon, moonIcon

function Signin() {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const root = document.documentElement;
        theme === 'dark' ? root.classList.add('dark') : root.classList.remove('dark');
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://servercomplients.onrender.com/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || 'Login successful', {
                    position: 'top-right',
                    autoClose: 3000,
                });

                // ✅ Save only token
                sessionStorage.setItem('token', data.token);
                setTimeout(() => navigate('/'), 1500);
            } else {
                toast.error(data.message || 'Invalid credentials', {
                    position: 'top-right',
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error('Login Error:', error);
            toast.error('Server error. Please try again later.', {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };

    // 🌞 Theme Icons
    const sunIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 12a5 5 0 100-10 5 5 0 000 10z"
            />
        </svg>
    );

    const moonIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
        </svg>
    );


    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 transition-colors duration-300 dark:bg-gray-900">
            <div className="relative w-full max-w-md rounded-xl bg-white p-8 shadow-2xl transition-colors duration-300 dark:bg-gray-800">
                <button
                    onClick={toggleTheme}
                    className="absolute top-4 right-4 rounded-full p-2 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                    {theme === 'light' ? moonIcon : sunIcon}
                </button>

                <h2 className="mb-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
                    Sign In
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email<span className="text-red-500 ml-1">*</span>
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
                            Password<span className="text-red-500 ml-1">*</span>
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

                    <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        Sign In
                    </button>

                    <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/Signup" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                            Sign Up
                        </Link>
                    </p>
                </form>
            </div>

            <ToastContainer />
        </div>
    );
}

export default Signin;
