import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SignatureField from "./SignatureField";
import WaxSealButton from "./WaxSealButton";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle, sending, success, error
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:3001/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        const data = await response.json();
        throw new Error(data.message || "Connection interrupted.");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage(error.message);
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  // Animation variants for form fields
  const fieldVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <div className="relative">
      {/* Enhanced Glassmorphism Container */}
      <div className="relative bg-[var(--color-surface)]/60 backdrop-blur-xl border border-[var(--color-border)]/50 p-8 md:p-10 rounded-2xl overflow-hidden shadow-2xl">
        {/* Decorative Corner Accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[var(--color-accent)]" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[var(--color-accent)]" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[var(--color-accent)]" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[var(--color-accent)]" />

        {/* Inner glass reflection */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none rounded-2xl" />

        <div className="mb-8 flex items-center justify-between">
          <h3 className="font-cinzel text-xl text-[var(--color-text-primary)]">
            START HERE
          </h3>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-text-primary)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-text-primary)] shadow-lg shadow-[var(--color-text-primary)]/50"></span>
            </span>
            <span className="font-mono-tech text-[10px] text-[var(--color-accent)] tracking-widest">
              AVAILABLE
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name Field */}
          <motion.div
            custom={0}
            variants={fieldVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <label
              htmlFor="name"
              className="block font-mono-tech text-xs text-[var(--color-text-secondary)] uppercase tracking-widest mb-2"
            >
              Your Name / Blueprint Owner
            </label>
            <SignatureField
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Who leads this project?"
              className="bg-transparent border-b border-[var(--color-border)] rounded-none px-0 focus:ring-0 focus:border-[var(--color-accent)] transition-colors"
            />
          </motion.div>

          {/* Email Field */}
          <motion.div
            custom={1}
            variants={fieldVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <label
              htmlFor="email"
              className="block font-mono-tech text-xs text-[var(--color-text-secondary)] uppercase tracking-widest mb-2"
            >
              Primary Channel
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@company.com"
              className="w-full bg-transparent border-b border-[var(--color-border)] py-3 text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/30 focus:outline-none focus:border-[var(--color-accent)] transition-colors font-mono-tech text-sm"
            />
          </motion.div>

          {/* Message Field */}
          <motion.div
            custom={2}
            variants={fieldVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <label
              htmlFor="message"
              className="block font-mono-tech text-xs text-[var(--color-text-secondary)] uppercase tracking-widest mb-2"
            >
              Project Outline
            </label>
            <textarea
              id="message"
              name="message"
              rows="4"
              required
              value={formData.message}
              onChange={handleChange}
              placeholder="What are we building? Vision, scope, timeline..."
              className="w-full bg-transparent border-b border-[var(--color-border)] py-3 text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/30 focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none font-sans text-base leading-relaxed"
            />
          </motion.div>

          {/* Submit Button */}
          <motion.div
            custom={3}
            variants={fieldVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="pt-4"
          >
            <WaxSealButton
              isLoading={status === "sending"}
              isSuccess={status === "success"}
              disabled={status === "sending"}
              className="bg-[var(--color-accent)] text-black hover:bg-[var(--color-accent-hover)] border-none rounded-lg"
            >
              INITIATE BUILD
            </WaxSealButton>
          </motion.div>

          {/* Status Messages */}
          <AnimatePresence>
            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-500 text-xs font-mono-tech mt-2"
              >
                ERROR: {errorMessage}
              </motion.div>
            )}
            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-green-500 text-xs font-mono-tech mt-2"
              >
                BLUEPRINT RECEIVED. FOUNDATION LAID. EXPECT RESPONSE WITHIN 24
                HOURS.
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      {/* Background Glow - more subtle */}
      <div className="absolute -inset-8 bg-[var(--color-accent)]/3 blur-3xl -z-10 rounded-full opacity-40 pointer-events-none" />
    </div>
  );
};

export default ContactForm;
