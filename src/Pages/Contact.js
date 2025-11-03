// File: src/Pages/Contact.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from "lucide-react";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        alert("Your message has been sent!");
        setFormData({ name: "", email: "", message: "" });
    };

    return (
        <section
            id="contact"
            className="px-6 sm:px-10 md:px-20 py-20 bg-blue-50 dark:bg-gray-900 transition-colors duration-500"
        >
            <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-800 dark:text-blue-400 mb-16">
                Contact Us
            </h2>

            <div className="grid md:grid-cols-2 gap-10 items-start">
                {/* LEFT SIDE — Contact Info */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col justify-center space-y-8 text-gray-700 dark:text-gray-300"
                >
                    <div>
                        <h3 className="text-2xl font-semibold text-blue-800 dark:text-blue-300 mb-3">
                            Get in Touch
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            We’d love to hear from you. Whether you have a question about features,
                            feedback, or anything else — our team is ready to help!
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <Mail className="text-blue-600 w-6 h-6" />
                            <span>support@grievanceportal.com</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Phone className="text-blue-600 w-6 h-6" />
                            <span>+91 98765 43210</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <MapPin className="text-blue-600 w-6 h-6" />
                            <span>123 Innovation Street, Hyderabad, India</span>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className="flex space-x-5 pt-4">
                        <a
                            href="https://facebook.com/yourpage"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full bg-blue-100 dark:bg-gray-700 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition"
                        >
                            <Facebook className="w-5 h-5" />
                        </a>

                        <a
                            href="https://twitter.com/yourhandle"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full bg-blue-100 dark:bg-gray-700 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition"
                        >
                            <Twitter className="w-5 h-5" />
                        </a>

                        <a
                            href="https://linkedin.com/in/yourprofile"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full bg-blue-100 dark:bg-gray-700 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition"
                        >
                            <Linkedin className="w-5 h-5" />
                        </a>
                    </div>
                </motion.div>

                {/* RIGHT SIDE — Contact Form */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8"
                >
                    <h3 className="text-2xl font-semibold text-blue-800 dark:text-blue-300 mb-6">
                        Send us a message
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Message
                            </label>
                            <textarea
                                name="message"
                                rows="4"
                                required
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
                        >
                            Send Message
                        </button>
                    </form>
                </motion.div>
            </div>
        </section>
    );
};

export default Contact;
