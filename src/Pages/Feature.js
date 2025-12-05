// File: src/Pages/Feature.js
import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, BarChart3, Bookmark, Users } from "lucide-react";

const features = [
    {
        icon: AlertTriangle,
        title: "Complaint Tracking",
        desc: "Log and monitor grievances with ease and transparency.",
    },
    {
        icon: BarChart3,
        title: "Analytics Dashboard",
        desc: "Gain insights into complaint trends and performance.",
    },
    {
        icon: Bookmark,
        title: "Bookmark System",
        desc: "Save important records for quick access.",
    },
    {
        icon: Users,
        title: "User Management",
        desc: "Secure user roles and access control powered by JWT.",
    },
];

const Feature = () => {
    return (
        <section
            id="features"
            className="px-6 sm:px-10 md:px-20 py-20 bg-blue-50 dark:bg-gray-900 transition-colors duration-500"
        >
            <h3 className="text-3xl md:text-4xl font-bold text-center text-blue-800 dark:text-blue-400 mb-16">
                Key Features
            </h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {features.map((feature, i) => {
                    const Icon = feature.icon;
                    return (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.05, y: -5 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="bg-white dark:bg-gray-800 shadow-md hover:shadow-xl rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300"
                        >
                            <Icon className="text-blue-600 dark:text-blue-400 w-12 h-12 mb-3" />
                            <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                                {feature.title}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                {feature.desc}
                            </p>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
};

export default Feature;
