import { useState, useEffect } from "react";
import ScrollReveal from "./ScrollReveal";
import { GraduationCap, Award, Globe2 } from "lucide-react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";

interface Achievement {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  type: "education" | "certification" | "language";
}

const EducationSection = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const unsub = onValue(ref(db, "achievements"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setAchievements(Object.keys(data).map(key => ({ id: key, ...data[key] })));
      } else {
        setAchievements([]);
      }
    });

    return () => unsub();
  }, []);

  const education = achievements.filter(a => a.type === "education");
  const certifications = achievements.filter(a => a.type === "certification");
  const languages = achievements.filter(a => a.type === "language");

  return (
    <section id="education" className="py-24 relative z-10">
      <div className="container mx-auto px-6 max-w-4xl">
        <ScrollReveal>
          <h2 className="section-title text-center">
            Education & <span className="gradient-text">More</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12">My academic journey</p>
        </ScrollReveal>

        {/* Education */}
        {education.length > 0 && (
          <div className="space-y-4 mb-16">
            {education.map((edu, i) => (
              <ScrollReveal key={edu.id} delay={i * 0.1}>
                <div className="glass-card glass-card-hover p-6 flex items-start gap-4">
                  <GraduationCap className="text-primary mt-1 flex-shrink-0" size={22} />
                  <div>
                    <h3 className="font-heading font-semibold">{edu.title}</h3>
                    {edu.subtitle && <p className="text-muted-foreground text-sm">{edu.subtitle}</p>}
                    {edu.year && <span className="text-xs text-accent">{edu.year}</span>}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <>
            <ScrollReveal>
              <h3 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
                <Award className="text-primary" size={20} /> Certifications
              </h3>
            </ScrollReveal>
            <div className="grid sm:grid-cols-3 gap-4 mb-16">
              {certifications.map((cert, i) => (
                <ScrollReveal key={cert.id} delay={i * 0.1}>
                  <div className="glass-card glass-card-hover p-5 text-center text-sm text-foreground/80 flex flex-col items-center justify-center h-full">
                    <span className="font-semibold text-primary/90">{cert.title}</span>
                    {cert.subtitle && <span className="text-xs text-muted-foreground mt-1">{cert.subtitle}</span>}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <>
            <ScrollReveal>
              <h3 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
                <Globe2 className="text-accent" size={20} /> Languages
              </h3>
            </ScrollReveal>
            <div className="grid sm:grid-cols-3 gap-4">
              {languages.map((l, i) => (
                <ScrollReveal key={l.id} delay={i * 0.1}>
                  <div className="glass-card glass-card-hover p-5 text-center flex flex-col items-center justify-center h-full">
                    <p className="font-semibold text-primary">{l.title}</p>
                    {l.subtitle && <p className="text-xs text-muted-foreground mt-1">{l.subtitle}</p>}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default EducationSection;
