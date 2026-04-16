import React, { useState, useEffect } from "react";
import ScrollReveal from "./ScrollReveal";
import { Code, Globe, Wrench, Users, Shield } from "lucide-react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";

const iconMap: Record<string, React.ReactNode> = {
  "Programming": <Code size={20} />,
  "Web Development": <Globe size={20} />,
  "Tools": <Wrench size={20} />,
  "Soft Skills": <Users size={20} />,
};

interface Skill {
  id: string;
  name: string;
  level: string;
}

const SkillsSection = () => {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const unsub = onValue(ref(db, "skills"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setSkills(Object.keys(data).map(key => ({ id: key, ...data[key] })));
      } else {
        setSkills([]);
      }
    });
    return () => unsub();
  }, []);

  // Group skills by their generic "level/category" string
  const groupedSkills = skills.reduce((acc: Record<string, Skill[]>, skill: Skill) => {
    const groupName = skill.level || "Other";
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <h2 className="section-title text-center">
            My <span className="gradient-text">Skills</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12">Technologies & abilities</p>
        </ScrollReveal>

        {skills.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {Object.keys(groupedSkills).map((groupName, i) => (
              <ScrollReveal key={groupName} delay={i * 0.1}>
                <div className="glass-card glass-card-hover p-6 h-full border border-primary/10">
                  <div className="flex items-center gap-3 mb-5 border-b border-primary/10 pb-3">
                    <span className="text-primary">{iconMap[groupName] || <Shield size={20} />}</span>
                    <h3 className="font-heading font-semibold text-lg">{groupName}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {groupedSkills[groupName].map((skill: Skill) => (
                      <span 
                        key={skill.id}
                        className="px-3 py-1.5 bg-primary/5 text-foreground/80 border border-primary/20 rounded-md text-sm font-medium hover:bg-primary/10 transition-colors"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No skills added yet.</p>
        )}
      </div>
    </section>
  );
};

export default SkillsSection;
