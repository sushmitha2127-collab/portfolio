import { useState, useEffect } from "react";
import ScrollReveal from "./ScrollReveal";
import { Mail, Phone, Github, Linkedin, Send } from "lucide-react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [contactInfo, setContactInfo] = useState({
    email: "sushmithatumkur2127@gmail.com",
    phone: "9482139572",
    linkedin: "https://www.linkedin.com/in/sushmitha-s-875077318",
    github: "https://github.com/sushmitha2127-collab"
  });

  useEffect(() => {
    const unsub = onValue(ref(db, "contact"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setContactInfo(prev => ({ ...prev, ...data }));
      }
    });

    return () => unsub();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the form
    alert("Thank you for your message! I'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="py-24 relative z-10">
      <div className="container mx-auto px-6 max-w-4xl">
        <ScrollReveal>
          <h2 className="section-title text-center">
            Get in <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12">Let's connect</p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Info */}
          <ScrollReveal delay={0.1}>
            <div className="glass-card p-8 h-full space-y-6">
              <h3 className="font-heading font-semibold text-lg">Contact Info</h3>

              {contactInfo.email && (
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-center gap-3 text-foreground/80 hover:text-primary transition-colors"
                >
                  <Mail size={18} className="text-primary" />
                  <span className="text-sm break-all">{contactInfo.email}</span>
                </a>
              )}

              {contactInfo.phone && (
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="flex items-center gap-3 text-foreground/80 hover:text-primary transition-colors"
                >
                  <Phone size={18} className="text-primary" />
                  <span className="text-sm">{contactInfo.phone}</span>
                </a>
              )}

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-3">Find me on</p>
                <div className="flex gap-3">
                  {contactInfo.github && (
                    <a
                      href={contactInfo.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-card glass-card-hover p-3 rounded-lg"
                    >
                      <Github size={20} className="text-primary" />
                    </a>
                  )}
                  {contactInfo.linkedin && (
                    <a
                      href={contactInfo.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-card glass-card-hover p-3 rounded-lg"
                    >
                      <Linkedin size={20} className="text-accent" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Form */}
          <ScrollReveal delay={0.2}>
            <form onSubmit={handleSubmit} className="glass-card p-8 space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
              />
              <input
                type="email"
                placeholder="Your Email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
              />
              <textarea
                placeholder="Your Message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors resize-none"
              />
              <button type="submit" className="neon-button w-full flex items-center justify-center gap-2">
                <Send size={16} /> Send Message
              </button>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
