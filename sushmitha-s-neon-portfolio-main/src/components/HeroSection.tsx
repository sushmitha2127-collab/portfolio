import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, ArrowDown } from "lucide-react";
import profileImg from "@/assets/profile.png";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";

const HeroSection = () => {
  const [profile, setProfile] = useState({ name: "Sushmitha S", role: "Front-End Developer, BCA Student", about: "Frontend developer who enjoys turning ideas into websites." });
  const [contact, setContact] = useState({ linkedin: "https://www.linkedin.com/in/sushmitha-s-875077318", github: "https://github.com/sushmitha2127-collab" });

  const displayRoles = useMemo(() => {
    const roles = profile.role.split(",").map(r => r.trim()).filter(Boolean);
    return roles.length > 0 ? roles : ["Developer"];
  }, [profile.role]);

  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const unsubProfile = onValue(ref(db, "profile"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setProfile(prev => ({ ...prev, ...data }));
      }
    });
    
    const unsubContact = onValue(ref(db, "contact"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setContact(prev => ({ ...prev, ...data }));
      }
    });

    return () => {
      unsubProfile();
      unsubContact();
    };
  }, []);

  useEffect(() => {
    // Reset typing effect if roles change drastically
    if (roleIndex >= displayRoles.length) setRoleIndex(0);
    
    const current = displayRoles[roleIndex] || "";
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && text.length < current.length) {
      timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), 80);
    } else if (!deleting && text.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && text.length > 0) {
      timeout = setTimeout(() => setText(text.slice(0, -1)), 40);
    } else if (deleting && text.length === 0) {
      setDeleting(false);
      setRoleIndex((prev) => (prev + 1) % displayRoles.length);
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, roleIndex, displayRoles]);

  const scrollTo = (id: string) =>
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center gap-8">
          {/* Profile Image – Centered */}
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative group">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary to-accent opacity-50 blur-lg group-hover:opacity-80 transition-opacity duration-500" />
              <img
                src={profileImg}
                alt={profile.name}
                className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-full object-cover border-2 border-primary/40 shadow-lg transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </motion.div>

          {/* Text – Centered below image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              <span className="gradient-text">{profile.name}</span>
            </h1>
            <div className="h-8 mb-4">
              <span className="text-xl text-accent font-medium">
                {text}
                <span className="typing-cursor text-primary">|</span>
              </span>
            </div>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8 leading-relaxed whitespace-pre-line">
              {profile.about}
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              <button onClick={() => scrollTo("#projects")} className="neon-button text-sm">
                View Projects
              </button>
              <button onClick={() => scrollTo("#contact")} className="neon-button-outline text-sm">
                Contact Me
              </button>
              {contact.linkedin && (
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neon-button-outline text-sm inline-flex items-center gap-2"
                >
                  <Linkedin size={16} /> LinkedIn
                </a>
              )}
              {contact.github && (
                <a
                  href={contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neon-button-outline text-sm inline-flex items-center gap-2"
                >
                  <Github size={16} /> GitHub
                </a>
              )}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown className="text-primary/50" size={24} />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
