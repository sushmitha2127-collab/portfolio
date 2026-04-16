import { useState, useEffect } from "react";
import ScrollReveal from "./ScrollReveal";
import { User } from "lucide-react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";

const AboutSection = () => {
  const [about, setAbout] = useState(
    "I'm Sushmitha S, a BCA student at Vidyavahini First Grade College with a deep passion for programming and web development. I love crafting clean, responsive user interfaces and bringing creative ideas to life through code. With solid foundations in HTML, CSS, and JavaScript, I enjoy building modern web experiences with attention to detail and aesthetics.\n\nMy goal is to grow as a software developer and contribute meaningfully to impactful applications. I'm seeking a challenging position where I can effectively apply my technical skills and continue learning in a professional environment. I believe in continuous improvement and building technology that makes a difference."
  );

  useEffect(() => {
    const unsub = onValue(ref(db, "profile"), (snapshot) => {
      if (snapshot.exists() && snapshot.val().about) {
        setAbout(snapshot.val().about);
      }
    });

    return () => unsub();
  }, []);

  const paragraphs = about.split('\n').filter(p => p.trim() !== "");

  return (
    <section id="about" className="py-24 relative z-10">
      <div className="container mx-auto px-6 max-w-4xl">
        <ScrollReveal>
          <h2 className="section-title text-center">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12">Get to know me better</p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="glass-card p-8 space-y-6">
            {paragraphs.map((para, i) => (
              <div key={i} className="flex items-start gap-4">
                <User className="text-primary mt-1 flex-shrink-0" size={22} />
                <p className="text-foreground/85 leading-relaxed whitespace-pre-wrap">
                  {para}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default AboutSection;
