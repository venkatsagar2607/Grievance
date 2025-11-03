import React from "react";
import { motion } from "framer-motion";
import { Users, Target, ShieldCheck, Sparkles } from "lucide-react";

export default function About() {
    const aboutCards = [
        {
            icon: Users,
            title: "Who We Are",
            text: "We are a passionate team dedicated to simplifying grievance management using cutting-edge technology and user-centered design.",
        },
        {
            icon: Target,
            title: "Our Mission",
            text: "To empower customers and organizations with an intelligent platform that makes complaint resolution faster, transparent, and effective.",
        },
        {
            icon: ShieldCheck,
            title: "Our Vision",
            text: "Building trust through data-driven insights and fair grievance handling, ensuring customer satisfaction at every step.",
        },
        {
            icon: Sparkles,
            title: "Our Values",
            text: "Integrity, innovation, and empathy drive everything we build — ensuring both customers and businesses win together.",
        },
    ];

    return (
        <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-950 dark:to-gray-900 transition-colors duration-500 text-gray-800 dark:text-gray-100">
            <section
                id="about"
                className="px-10 md:px-20 py-20 bg-white dark:bg-gray-900 transition-colors duration-500"
            >
                <div className="max-w-6xl mx-auto text-center">
                    <motion.h2
                        className="text-4xl md:text-5xl font-bold text-blue-800 dark:text-blue-400 mb-8"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        About <span className="text-blue-500 dark:text-blue-300">Grievance Grabber</span>
                    </motion.h2>

                    <motion.p
                        className="text-gray-700 dark:text-gray-300 text-lg max-w-3xl mx-auto mb-16 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        Grievance Grabber is a modern platform that empowers organizations and individuals
                        to manage, track, and analyze complaints with ease. We combine data analytics, intuitive UI,
                        and real-time tracking to deliver a smarter grievance management experience.
                    </motion.p>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        {aboutCards.map((card, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.05, y: -5 }}
                                transition={{ type: "spring", stiffness: 200 }}
                                className="bg-blue-50 dark:bg-gray-800 rounded-3xl shadow-md p-8 text-center border border-blue-100 dark:border-gray-700"
                            >
                                <card.icon className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-2">
                                    {card.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                    {card.text}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
