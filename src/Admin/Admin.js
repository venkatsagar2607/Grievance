import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import Nav from "../Navigation/Navigate";
import {
    CheckCircle,
    Clock,
    UserCog,
    AlertTriangle,
    ClipboardList,
    Search,
    Eye,
    BarChart2,
    Filter,
} from "lucide-react";

export default function AdminDashboard() {
    const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mainUser, setMainUser] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [complaints, setComplaints] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [viewModal, setViewModal] = useState(false);
    const [activeTab, setActiveTab] = useState("All Complaints");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const getUserDetails = async (d_id) => {
        try {
            const res = await fetch("https://servercomplients.onrender.com/api/user-details", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: d_id }),
            });
            const data = await res.json();
            if (res.ok) {
                setMainUser(data.userDetails);
                setUserDetails(data.userDetails);
            }
        } catch (err) {
            console.error("Error fetching user details:", err);
        }
    };

    const fetchComplaints = async () => {
        try {
            const res = await fetch("https://servercomplients.onrender.com/api/all-complaints");
            const data = await res.json();
            if (res.ok) setComplaints(data.complaints || []);
        } catch (err) {
            console.error("Error fetching complaints:", err);
        }
    };

    const fetchWorkers = async () => {
        try {
            const res = await fetch("https://servercomplients.onrender.com/api/workers");
            const data = await res.json();
            if (res.ok) setWorkers(data.workers || []);
        } catch (err) {
            console.error("Error fetching workers:", err);
        }
    };

    const assignComplaint = async (complaintId, workerId) => {
        if (!workerId) return;
        try {
            const res = await fetch(`https://servercomplients.onrender.com/api/assign-complaint/${complaintId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ workerId }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                alert("✅ Complaint assigned successfully!");
                fetchComplaints();
            } else {
                alert(data.message || "Failed to assign complaint.");
            }
        } catch (err) {
            console.error("Error assigning complaint:", err);
        }
    };

    const resolveComplaint = async (complaintId) => {
        try {
            const res = await fetch(`https://servercomplients.onrender.com/api/resolve-complaint/${complaintId}`, {
                method: "PUT",
            });
            const data = await res.json();
            if (res.ok && data.success) {
                alert("✅ Complaint marked as resolved!");
                fetchComplaints();
                setViewModal(false);
            } else {
                alert(data.message || "Failed to resolve complaint.");
            }
        } catch (err) {
            console.error("Error resolving complaint:", err);
        }
    };

    const handleView = (complaint) => {
        setSelectedComplaint(complaint);
        setViewModal(true);
    };

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                getUserDetails(decoded.id);
            } catch (err) {
                console.error("Invalid token:", err);
            }
        }
        fetchComplaints();
        fetchWorkers();
    }, []);

    const stats = {
        total: complaints.length,
        pending: complaints.filter((c) => c.status === "Pending").length,
        resolved: complaints.filter((c) => c.status === "Resolved").length,
        inProgress: complaints.filter((c) => c.status === "In Progress").length,
    };

    // Frequency calculation
    const categoryFrequency = complaints.reduce((acc, curr) => {
        const key = curr.groupName || "Uncategorized";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    const sortedFrequency = Object.entries(categoryFrequency).sort((a, b) => b[1] - a[1]);

    // Filter by tab
    let filteredComplaints = complaints;
    if (activeTab === "Pending") filteredComplaints = complaints.filter((c) => c.status === "Pending");
    if (activeTab === "Resolved") filteredComplaints = complaints.filter((c) => c.status === "Resolved");
    if (selectedCategory !== "All")
        filteredComplaints = filteredComplaints.filter((c) => c.groupName === selectedCategory);

    return (
        <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-500">
            <Nav
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                mainUser={mainUser}
                userDetails={userDetails}
            />

            <main className={`flex-1 p-10 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-400 flex items-center gap-3">
                        <UserCog className="w-7 h-7" /> Admin Dashboard
                    </h1>
                    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                        <Search className="w-4 h-4 text-gray-500 mr-2" />
                        <input
                            type="text"
                            placeholder="Search complaints..."
                            className="bg-transparent outline-none text-sm w-48"
                        />
                    </div>
                </div>

                {/* Stats Cards */}
                <motion.div
                    className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <StatCard icon={ClipboardList} color="text-blue-600" title="Total Complaints" value={stats.total} />
                    <StatCard icon={Clock} color="text-yellow-500" title="Pending" value={stats.pending} />
                    <StatCard icon={CheckCircle} color="text-green-500" title="Resolved" value={stats.resolved} />
                    <StatCard icon={AlertTriangle} color="text-orange-500" title="In Progress" value={stats.inProgress} />
                </motion.div>

                {/* Tabs for Filtering */}
                <div className="flex space-x-6 border-b border-gray-300 dark:border-gray-700 mb-6">
                    {["All Complaints", "Frequency", "Pending", "Resolved"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-2 text-sm font-semibold transition-all ${activeTab === tab
                                ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                                : "text-gray-600 dark:text-gray-400 hover:text-blue-500"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Frequency Table */}
                {activeTab === "Frequency" && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-10">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-700 dark:text-blue-300">
                            <BarChart2 className="w-5 h-5" /> Complaint Frequency by Category
                        </h2>
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b dark:border-gray-700 text-gray-600 dark:text-gray-300">
                                    <th className="pb-3">Category</th>
                                    <th className="pb-3">Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedFrequency.map(([category, count], idx) => (
                                    <tr key={idx} className="border-b dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-800 transition">
                                        <td className="py-2">{category}</td>
                                        <td className="py-2 font-semibold">{count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Manage Complaints */}
                {activeTab !== "Frequency" && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300">Manage Complaints</h2>

                            {/* Sorting dropdown */}
                            <div className="flex items-center gap-2">
                                <Filter className="w-5 h-5 text-gray-500" />
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-sm"
                                >
                                    <option value="All">All Categories</option>
                                    {Object.keys(categoryFrequency).map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b dark:border-gray-700 text-gray-600 dark:text-gray-300">
                                    <th className="pb-3">ID</th>
                                    <th className="pb-3">Category</th>
                                    <th className="pb-3">User Email</th>
                                    <th className="pb-3">Status</th>
                                    <th className="pb-3">Assign Worker</th>
                                    <th className="pb-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredComplaints.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-6 text-gray-500">
                                            No complaints found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredComplaints.map((c) => (
                                        <tr
                                            key={c._id}
                                            className="border-b dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-800 transition"
                                        >
                                            <td className="py-3">{c._id.slice(-6).toUpperCase()}</td>
                                            <td>{c.groupName}</td>
                                            <td>{c.userEmail || "N/A"}</td>
                                            <td>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-semibold ${c.status === "Resolved"
                                                        ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                                                        : c.status === "In Progress"
                                                            ? "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300"
                                                            : "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300"
                                                        }`}
                                                >
                                                    {c.status}
                                                </span>
                                            </td>
                                            <td>
                                                <select
                                                    onChange={(e) => assignComplaint(c._id, e.target.value)}
                                                    defaultValue={c.assignedTo || ""}
                                                    className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-sm"
                                                >
                                                    <option value="">Select Worker</option>
                                                    {workers.map((w) => (
                                                        <option key={w._id} value={w._id}>
                                                            {w.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="text-center space-x-3">
                                                <button
                                                    onClick={() => handleView(c)}
                                                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                                                >
                                                    <Eye className="w-4 h-4 inline-block mr-1" />
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
                    © {new Date().getFullYear()} Grievance Grabber — Admin Panel
                </footer>
            </main>

            {/* View Complaint Modal */}
            {viewModal && selectedComplaint && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div
                        className={`rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
                            }`}
                    >
                        <button
                            onClick={() => setViewModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
                        >
                            &times;
                        </button>

                        <h2
                            className={`text-2xl font-bold text-center mb-6 ${darkMode ? "text-blue-400" : "text-blue-600"
                                }`}
                        >
                            Complaint Details
                        </h2>

                        <div className="space-y-4">
                            <p><strong>Category:</strong> {selectedComplaint.groupName || "-"}</p>
                            <p><strong>Issue:</strong> {selectedComplaint.parentName || "-"}</p>
                            <p><strong>Company:</strong> {selectedComplaint.sectionName || "-"}</p>
                            <p><strong>Description:</strong> {selectedComplaint.issue || "-"}</p>
                            <p><strong>Status:</strong> {selectedComplaint.status}</p>
                            <p><strong>Date:</strong> {new Date(selectedComplaint.date).toLocaleDateString()}</p>
                        </div>

                        <div className="flex justify-center gap-4 mt-6">
                            {selectedComplaint.status !== "Resolved" && (
                                <button
                                    onClick={() => resolveComplaint(selectedComplaint._id)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                                >
                                    Mark as Resolved
                                </button>
                            )}
                            <button
                                onClick={() => setViewModal(false)}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* Stat Card */
const StatCard = ({ icon: Icon, color, title, value }) => (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md flex items-center gap-4">
        <Icon className={`w-10 h-10 ${color}`} />
        <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);
