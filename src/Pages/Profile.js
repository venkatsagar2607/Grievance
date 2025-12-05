// File: src/Pages/Profile.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Nav from "../Navigation/Navigate"; // ✅ imported sidebar

export default function Profile() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
    const [userDetails, setUserDetails] = useState(undefined);
    const [mainUser, setMainUser] = useState(undefined);

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

    const getUserDetails = async (d_id) => {
        const response = await fetch("https://servercomplients.onrender.com/api/user-details", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: d_id }),
        });
        const data = await response.json();
        if (response.ok) {
            setMainUser(data.userDetails);
            setUserDetails(data.userDetails);
        }
    };

    useEffect(() => {
        document.documentElement.classList.toggle("dark", darkMode);
        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    const handleChange = async (e) => {
        const { name, value } = e.target;
        if (name === "pincode" && value.length === 6) {
            try {
                const response = await axios.get(`https://api.postalpincode.in/pincode/${value}`);
                const data = response.data[0];
                if (data.PostOffice && data.PostOffice[0]) {
                    setUserDetails((prev) => ({
                        ...prev,
                        pincode: value,
                        state: data.PostOffice[0].State,
                        city: data.PostOffice[0].Block || data.PostOffice[0].District,
                    }));
                }
            } catch {
                setUserDetails((prev) => ({ ...prev, pincode: value, city: "", state: "" }));
            }
        } else {
            setUserDetails((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = async () => {
        try {
            const token = sessionStorage.getItem("token");
            if (!token) {
                alert("Please login first.");
                navigate("/Signin");
                return;
            }
            const res = await axios.post("https://servercomplients.onrender.com/api/profile", userDetails, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.data.success) {
                setMainUser(res.data.user);
                setUserDetails(res.data.user);
                alert(`✅ ${res.data.message}`);
            } else alert("❌ Failed to update profile");
        } catch (err) {
            console.error("Error updating profile:", err);
            alert("❌ Server error updating profile!");
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-950 dark:to-gray-900 transition-colors duration-500 text-gray-800 dark:text-gray-100">
            <Nav
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                mainUser={mainUser}
            />

            <main
                className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"
                    } p-10`}
            >
                <div className="max-w-5xl mx-auto w-full">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                            👤 Profile Page
                        </h1>
                    </div>

                    <div className="bg-white dark:bg-gray-800 shadow-lg p-8 rounded-2xl">
                        <div className="w-24 h-24 flex items-center justify-center rounded-full bg-blue-500 text-white text-3xl font-semibold mx-auto mb-6">
                            {mainUser?.name ? mainUser.name.charAt(0).toUpperCase() : "P"}
                        </div>

                        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {userDetails && mainUser && Object.entries({
                                name: "Full Name",
                                email: "Email Address",
                                phone: "Phone Number",
                                dob: "Date of Birth",
                                pincode: "Pincode",
                                address1: "Address Line 1",
                                address2: "Address Line 2",
                                city: "City",
                                state: "State",
                            }).map(([key, label]) => (
                                <div
                                    key={key}
                                    className={["address1", "address2"].includes(key) ? "md:col-span-2" : ""}
                                >
                                    <label className="block text-gray-700 dark:text-gray-300 mb-2">{label}</label>
                                    <input
                                        type={key === "dob" ? "date" : "text"}
                                        name={key}
                                        value={userDetails[key] || ""}
                                        onChange={handleChange}
                                        disabled={key === "city" || key === "state"}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                                            bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 
                                            focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            ))}
                        </form>

                        <div className="text-center mt-8">
                            <button
                                type="button"
                                onClick={handleSave}
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-transform hover:scale-105"
                            >
                                💾 Save Details
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
