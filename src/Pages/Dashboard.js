import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    Search,
    PlusCircle,
    Bookmark,
    BookmarkCheck,
} from "lucide-react";
import Nav from "../Navigation/Navigate";

const ISSUE_OPTIONS = {
    Banking: [
        "Unauthorized transactions (fraud, failed online payments)",
        "ATM withdrawal issues (amount deducted but not received)",
        "Delay in cheque clearing or fund transfer",
        "Excess service charges or penalties",
        "Loan-related grievances (hidden charges, wrong EMI deductions)",
    ],
    "Credit Card/Debit Card": [
        "Wrong billing or fraudulent charges",
        "Card delivery delays",
        "Dispute in interest calculation or refund",
        "Unwanted card activation or offers",
    ],
    Insurance: [
        "Claim rejection or delay in settlement",
        "Policy cancellation without notice",
        "Mis-selling of policies",
        "Premium refund issues",
    ],
    Investment: [
        "Non-receipt of redemption amount",
        "Incorrect NAV applied during transaction",
        "Delay in account statement or units allocation",
    ],
    "Digital Payment": [
        "Transaction failed but amount deducted",
        "Delay in refund after failed transaction",
        "Unresponsive customer support",
        "Fraudulent merchant activity",
    ],
    Loan: [
        "Loan processing delays",
        "Incorrect loan balance",
        "Hidden charges",
        "Wrong EMI deductions",
    ],
    "Other Financial Products": [
        "Credit reporting errors (CIBIL / credit score)",
        "Issues with NBFCs or loan apps",
        "Hidden terms and conditions in financial agreements",
    ],
};

export default function UserComplaintDashboard() {
    const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
    const [userDetails, setUserDetails] = useState(null);
    const [mainUser, setMainUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [complaints, setComplaints] = useState([]);
    const [stats, setStats] = useState({ pending: 0, progress: 0, resolved: 0 });
    const [activeTab, setActiveTab] = useState("My Complaints");

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        groupName: "",
        parentName: "",
        sectionName: "",
        category: "",
        issue: "",
        file: null,
    });

    // 🆕 New view modal state
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [viewModal, setViewModal] = useState(false);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", darkMode);
        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);

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
                fetchComplaints(data.userDetails.email);
            }
        } catch (err) {
            console.error("Error fetching user details:", err);
        }
    };

    const fetchComplaints = async (email) => {
        try {
            const res = await fetch("https://servercomplients.onrender.com/api/user-complaints", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (res.ok) {
                setComplaints(data.complaints || []);
                const pending = data.complaints.filter((c) => c.status === "Pending").length;
                const progress = data.complaints.filter((c) => c.status === "In Progress").length;
                const resolved = data.complaints.filter((c) => c.status === "Resolved").length;
                setStats({ pending, progress, resolved });
            }
        } catch (err) {
            console.error("Error fetching complaints:", err);
        }
    };

    const toggleBookmark = async (id, bookmarked) => {
        try {
            const res = await fetch("https://servercomplients.onrender.com/api/toggle-bookmark", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ complaintId: id, bookmarked }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setComplaints((prev) =>
                    prev.map((c) => (c._id === id ? { ...c, bookmarked } : c))
                );
            }
        } catch (err) {
            console.error("Error toggling bookmark:", err);
        }
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
    }, []);

    const handleNewComplaint = () => setShowModal(true);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
        if (name === "groupName") {
            setFormData((prev) => ({
                ...prev,
                parentName: "",
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userDetails) return;

        try {
            const payload = { ...formData, email: userDetails.email };
            const res = await fetch("https://servercomplients.onrender.com/api/create-complaint", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const result = await res.json();

            if (res.ok && result.success) {
                alert("Complaint created successfully!");
                setShowModal(false);
                setFormData({
                    groupName: "",
                    parentName: "",
                    sectionName: "",
                    category: "",
                    issue: "",
                    file: null,
                });
                fetchComplaints(userDetails.email);
            } else {
                alert(result.message || "Failed to submit complaint.");
            }
        } catch (err) {
            alert("Error submitting complaint!");
            console.error(err);
        }
    };

    // 🆕 Withdraw/Delete complaint
    const handleWithdraw = async (id) => {
        if (!window.confirm("Are you sure you want to withdraw this complaint?")) return;

        try {
            const res = await fetch(`https://servercomplients.onrender.com/api/delete-complaint/${id}`, {
                method: "DELETE",
            });
            const result = await res.json();

            if (res.ok && result.success) {
                alert("Complaint withdrawn successfully!");
                setComplaints((prev) => prev.filter((comp) => comp._id !== id));
                setViewModal(false);
            } else {
                alert(result.message || "Failed to withdraw complaint.");
            }
        } catch (err) {
            console.error("Error withdrawing complaint:", err);
            alert("Server error while withdrawing complaint!");
        }
    };

    // 🆕 Handle viewing complaint details
    const handleView = (complaint) => {
        setSelectedComplaint(complaint);
        setViewModal(true);
    };


    const filteredComplaints = complaints.filter((c) => {
        if (activeTab === "My Complaints") return true;
        if (activeTab === "Bookmarks") return c.bookmarked === true;
        if (activeTab === "Resolved") return c.status === "Resolved";
        return true;
    });

    const inputClass = darkMode
        ? "bg-gray-800 text-gray-100 placeholder-gray-400"
        : "bg-gray-100 text-gray-900 placeholder-gray-500";

    const specificIssues = ISSUE_OPTIONS[formData.groupName] || [];

    return (
        <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-950 dark:to-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-500">
            <Nav
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                userDetails={userDetails}
                mainUser={mainUser}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <main className={`flex-1 px-8 py-10 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-bold text-blue-800 dark:text-blue-400">
                        {mainUser && (mainUser.name + ",")} Dashboard
                    </h2>
                    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                        <Search className="w-4 h-4 text-gray-500 mr-2" />
                        <input type="text" placeholder="Search complaints..." className="bg-transparent outline-none text-sm w-48" />
                    </div>
                </div>

                <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <StatCard icon={AlertTriangle} color="text-red-500" title="Pending" value={stats.pending} />
                    <StatCard icon={Clock} color="text-blue-500" title="In Progress" value={stats.progress} />
                    <StatCard icon={CheckCircle} color="text-green-500" title="Resolved" value={stats.resolved} />
                </motion.div>

                <div className="flex justify-between items-center mb-6">
                    <button onClick={handleNewComplaint} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition">
                        <PlusCircle className="w-5 h-5" /> New Complaint
                    </button>
                    <button
                        onClick={() => setActiveTab("Bookmarks")}
                        className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-md transition"
                    >
                        <Bookmark className="w-5 h-5" /> Bookmarks
                    </button>
                </div>

                <div className="flex space-x-4 border-b border-gray-300 dark:border-gray-700 mb-8">
                    {["My Complaints", "Bookmarks", "Resolved"].map((tab) => (
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

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                    <h3 className="text-xl font-semibold mb-6 text-blue-800 dark:text-blue-300">{activeTab}</h3>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-600 dark:text-gray-300 border-b dark:border-gray-700">
                                <th className="pb-3">ID</th>
                                <th className="pb-3">Category</th>
                                <th className="pb-3">Company Name</th>
                                <th className="pb-3">Date</th>
                                <th className="pb-3">Status</th>
                                <th className="pb-3">Bookmark</th>
                                <th className="pb-3">View</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredComplaints.length > 0 ? (
                                filteredComplaints.map((c, index) => (
                                    <tr key={c._id || index} className="border-b dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-800 transition">
                                        <td className="py-3 font-medium">{index + 1}</td>
                                        <td>{c.groupName || "-"}</td>
                                        <td>{c.sectionName || "-"}</td>
                                        <td>{c.date ? new Date(c.date).toLocaleDateString() : "-"}</td>
                                        <td>
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-semibold ${c.status === "Resolved"
                                                    ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                                                    : c.status === "Pending"
                                                        ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                                                        : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                                                    }`}
                                            >
                                                {c.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => toggleBookmark(c._id, !c.bookmarked)}
                                                className="text-yellow-500 hover:text-yellow-600 transition"
                                                title={c.bookmarked ? "Remove Bookmark" : "Add Bookmark"}
                                            >
                                                {c.bookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleView(c)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-1.5 rounded-lg shadow-sm transition-all duration-200 dark:bg-blue-700 dark:hover:bg-blue-600"
                                            >
                                                View
                                            </button>
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="py-6 text-center text-gray-500 dark:text-gray-400">
                                        No complaints found in {activeTab}.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
                    © {new Date().getFullYear()} Grievance Grabber. All rights reserved.
                </footer>
            </main>

            {/* 🌟 New Complaint Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div
                        className={
                            "rounded-2xl shadow-2xl w-full max-w-3xl p-8 relative " +
                            (darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900")
                        }
                    >
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
                        >
                            &times;
                        </button>

                        <h2 className={"text-2xl font-bold text-center mb-6 " + (darkMode ? "text-blue-400" : "text-blue-600")}>
                            Create New Complaint
                        </h2>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={"block mb-1 text-sm font-medium " + (darkMode ? "text-gray-300" : "text-gray-700")}>
                                        Category
                                    </label>
                                    <select
                                        name="groupName"
                                        value={formData.groupName}
                                        onChange={handleChange}
                                        className={`w-full p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
                                    >
                                        <option value="">Select an Option</option>
                                        {Object.keys(ISSUE_OPTIONS).map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className={"block mb-1 text-sm font-medium " + (darkMode ? "text-gray-300" : "text-gray-700")}>
                                        Specific Issue
                                    </label>
                                    {specificIssues.length > 0 ? (
                                        <select
                                            name="parentName"
                                            value={formData.parentName}
                                            onChange={handleChange}
                                            className={`w-full p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
                                        >
                                            <option value="">Select Specific Issue</option>
                                            {specificIssues.map((issue) => (
                                                <option key={issue} value={issue}>
                                                    {issue}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            name="parentName"
                                            value={formData.parentName}
                                            onChange={handleChange}
                                            placeholder="Enter specific issue"
                                            className={`w-full p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={"block mb-1 text-sm font-medium " + (darkMode ? "text-gray-300" : "text-gray-700")}>
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        name="sectionName"
                                        value={formData.sectionName}
                                        onChange={handleChange}
                                        placeholder="Enter company name"
                                        className={`w-full p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
                                    />
                                </div>
                                <div>
                                    <label className={"block mb-1 text-sm font-medium " + (darkMode ? "text-gray-300" : "text-gray-700")}>
                                        Transaction ID
                                    </label>
                                    <input
                                        type="text"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        placeholder="Enter transaction ID"
                                        className={`w-full p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={"block mb-1 text-sm font-medium " + (darkMode ? "text-gray-300" : "text-gray-700")}>
                                    Description
                                </label>
                                <textarea
                                    rows="4"
                                    name="issue"
                                    value={formData.issue}
                                    onChange={handleChange}
                                    placeholder="Describe your issue here..."
                                    className={`w-full p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${inputClass}`}
                                ></textarea>
                            </div>

                            <div>
                                <label className={"block mb-1 text-sm font-medium " + (darkMode ? "text-gray-300" : "text-gray-700")}>
                                    Attach File (PDF)
                                </label>
                                <input
                                    type="file"
                                    name="file"
                                    accept=".pdf"
                                    onChange={handleChange}
                                    className={`w-full p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
                                />
                            </div>

                            <div className="flex justify-center mt-6">
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md shadow-lg transition-all duration-300"
                                >
                                    Submit Complaint
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 🔍 View Complaint Modal */}
            {viewModal && selectedComplaint && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div
                        className={
                            "rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative " +
                            (darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900")
                        }
                    >
                        <button
                            onClick={() => setViewModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
                        >
                            &times;
                        </button>

                        <h2
                            className={
                                "text-2xl font-bold text-center mb-6 " +
                                (darkMode ? "text-blue-400" : "text-blue-600")
                            }
                        >
                            Complaint Details
                        </h2>

                        <div className="space-y-4">
                            <p><strong>Category:</strong> {selectedComplaint.groupName || "-"}</p>
                            <p><strong>Specific Issue:</strong> {selectedComplaint.parentName || "-"}</p>
                            <p><strong>Company Name:</strong> {selectedComplaint.sectionName || "-"}</p>
                            <p><strong>Transaction ID:</strong> {selectedComplaint.category || "-"}</p>
                            <p><strong>Description:</strong> {selectedComplaint.issue || "-"}</p>
                            <p><strong>Date:</strong> {selectedComplaint.date ? new Date(selectedComplaint.date).toLocaleDateString() : "-"}</p>
                            <p>
                                <strong>Status:</strong>{" "}
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-semibold ${selectedComplaint.status === "Resolved"
                                        ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                                        : selectedComplaint.status === "Pending"
                                            ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                                            : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                                        }`}
                                >
                                    {selectedComplaint.status}
                                </span>
                            </p>
                        </div>

                        <div className="flex justify-center mt-6 gap-4">
                            <button
                                onClick={() => handleWithdraw(selectedComplaint._id)}
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-md shadow-lg transition-all duration-300"
                            >
                                Withdraw Complaint
                            </button>
                            <button
                                onClick={() => setViewModal(false)}
                                className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-6 py-2 rounded-md shadow-lg transition-all duration-300"
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

const StatCard = ({ icon: Icon, color, title, value }) => (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md flex items-center gap-4">
        <Icon className={`w-10 h-10 ${color}`} />
        <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);
