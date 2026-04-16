import { useState, useEffect } from "react";
import ScrollReveal from "./ScrollReveal";
import { ExternalLink, Github } from "lucide-react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";

interface Project {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  tech: string;
  github?: string;
  demo?: string;
}

const ProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const unsub = onValue(ref(db, "projects"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setProjects(Object.keys(data).map(key => ({ id: key, ...data[key] })));
      } else {
        setProjects([]);
      }
    });

    return () => unsub();
  }, []);

  return (
    <section id="projects" className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <h2 className="section-title text-center">
            My <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12">Things I've built</p>
        </ScrollReveal>

        {projects.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {projects.map((project, i) => (
              <ScrollReveal key={project.id} delay={i * 0.1}>
                <div className="glass-card glass-card-hover overflow-hidden h-full flex flex-col">
                  {/* Placeholder image area */}
                  <div className="h-40 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <span className="text-4xl font-heading font-bold gradient-text opacity-40 uppercase">
                      {project.title ? project.title.charAt(0) : "P"}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-heading font-semibold text-lg text-primary mb-1">
                      {project.title}
                    </h3>
                    {project.subtitle && <p className="text-sm text-accent mb-2">{project.subtitle}</p>}
                    <p className="text-foreground/70 text-sm leading-relaxed flex-1 mb-4 whitespace-pre-wrap">
                      {project.description}
                    </p>
                    {project.tech && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech.split(",").map((t: string, idx: number) => (
                          <span
                            key={idx}
                            className="text-xs px-2.5 py-1 rounded-full border border-primary/20 text-primary/80 bg-primary/5"
                          >
                            {t.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-3">
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="neon-button-outline text-xs flex items-center gap-1.5 py-2 px-3">
                          <Github size={14} /> View Code
                        </a>
                      )}
                      {project.demo && (
                        <a href={project.demo} target="_blank" rel="noopener noreferrer" className="neon-button text-xs flex items-center gap-1.5 py-2 px-3">
                          <ExternalLink size={14} /> Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No projects added yet.</p>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
