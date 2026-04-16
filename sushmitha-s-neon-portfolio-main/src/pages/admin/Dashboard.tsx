import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ref, onValue, set, push, remove, update } from "firebase/database";
import { db } from "../../firebase";
import { Settings as SettingsIcon, Plus, Trash2, Edit2, LogOut } from "lucide-react";
import { toast } from "sonner";

// Interfaces
interface Profile { name: string; role: string; about: string; }
interface Contact { email: string; phone: string; linkedin: string; github?: string; }
interface Item { id: string; [key: string]: string | number | boolean | undefined | null; }

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  
  // States
  const [profile, setProfile] = useState<Profile>({ name: "", role: "", about: "" });
  const [contact, setContact] = useState<Contact>({ email: "", phone: "", linkedin: "" });
  const [skills, setSkills] = useState<Item[]>([]);
  const [projects, setProjects] = useState<Item[]>([]);
  const [achievements, setAchievements] = useState<Item[]>([]);

  // Fetch Data
  useEffect(() => {
    const unsubProfile = onValue(ref(db, "profile"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setProfile({
          name: data.name || "",
          role: data.role || "",
          about: data.about || ""
        });
      }
    }, (error) => {
      console.error("Firebase Profile Error:", error);
      toast.error("Failed to load profile data");
    });
    const unsubContact = onValue(ref(db, "contact"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setContact({
          email: data.email || "",
          phone: data.phone || "",
          linkedin: data.linkedin || "",
          github: data.github || ""
        });
      }
    }, (error) => {
      console.error("Firebase Contact Error:", error);
      toast.error("Failed to load contact data");
    });
    
    const fetchList = (path: string, setter: (items: Item[]) => void) => {
      return onValue(ref(db, path), (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          // If Firebase returns an array (sometimes happens with indexed data), handle it
          const itemsArray = Array.isArray(data) 
            ? data.map((item, index) => ({ id: index.toString(), ...item }))
            : Object.keys(data).map(key => ({ id: key, ...data[key] }));
          setter(itemsArray);
        } else {
          setter([]);
        }
      }, (error) => {
        console.error(`Firebase ${path} error:`, error);
      });
    };
    
    const unsubSkills = fetchList("skills", setSkills);
    const unsubProjects = fetchList("projects", setProjects);
    const unsubAchievements = fetchList("achievements", setAchievements);

    return () => {
      unsubProfile(); unsubContact(); unsubSkills(); unsubProjects(); unsubAchievements();
    };
  }, []);

  // Handlers for single objects (Profile, Contact)
  const saveNode = async (path: string, data: Profile | Contact) => {
    try {
      await set(ref(db, path), data);
      toast.success(`${path} saved successfully`);
    } catch (e) {
      toast.error(`Failed to save ${path}`);
    }
  };

  // Handlers for lists
  const addListItem = async (path: string, defaultData: Omit<Item, "id">) => {
    try {
      await push(ref(db, path), defaultData);
      toast.success("Item added");
    } catch(e) {
      toast.error("Failed to add item");
    }
  };

  const updateListItem = async (path: string, id: string, data: Partial<Omit<Item, "id">>) => {
    try {
      await update(ref(db, `${path}/${id}`), data);
      toast.success("Item updated");
    } catch(e) {
      toast.error("Failed to update item");
    }
  };

  const deleteListItem = async (path: string, id: string) => {
    if(confirm("Are you sure?")) {
      try {
        await remove(ref(db, `${path}/${id}`));
        toast.success("Item deleted");
      } catch(e) {
        toast.error("Failed to delete item");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-primary/20 bg-background/50 p-6 hidden md:flex flex-col">
        <h2 className="text-2xl font-heading font-bold mb-8 gradient-text">Dashboard</h2>
        <nav className="flex-1 space-y-2">
          {["profile", "skills", "projects", "achievements", "contact"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors capitalize ${
                activeTab === tab ? "bg-primary/20 text-primary font-medium" : "hover:bg-primary/5 text-muted-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
        <div className="pt-4 border-t border-primary/20 space-y-2">
          <Link to="/admin/settings" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors px-4 py-2">
            <SettingsIcon size={18} /> Settings
          </Link>
          <button onClick={() => { localStorage.removeItem("adminAuth"); window.location.href="/admin/login"; }} className="flex w-full items-center gap-2 text-red-500/80 hover:text-red-500 transition-colors px-4 py-2">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between mb-8 pb-4 border-b border-primary/20">
          <select 
            value={activeTab} 
            onChange={(e) => setActiveTab(e.target.value)}
            className="bg-background border border-primary/20 rounded-lg p-2 capitalize"
          >
            {["profile", "skills", "projects", "achievements", "contact"].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <div className="flex gap-4">
             <Link to="/admin/settings"><SettingsIcon size={20}/></Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-3xl font-heading font-bold capitalize mb-8">{activeTab}</h1>

          {/* Profile Section */}
          {activeTab === "profile" && (
            <div className="glass-card p-6 space-y-4">
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input type="text" className="w-full bg-background/50 border border-primary/20 rounded p-2" value={profile.name || ""} onChange={e => setProfile({...profile, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm mb-1">Roles (comma separated)</label>
                <input type="text" className="w-full bg-background/50 border border-primary/20 rounded p-2" value={profile.role || ""} onChange={e => setProfile({...profile, role: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm mb-1">About</label>
                <textarea rows={5} className="w-full bg-background/50 border border-primary/20 rounded p-2" value={profile.about || ""} onChange={e => setProfile({...profile, about: e.target.value})} />
              </div>
              <button className="neon-button px-4 py-2 text-sm" onClick={() => saveNode("profile", profile)}>Save Profile</button>
            </div>
          )}

          {/* Skills Section */}
          {activeTab === "skills" && (
            <div className="space-y-4">
              <button 
                onClick={() => addListItem("skills", { name: "New Skill", level: "Beginner" })}
                className="neon-button-outline px-4 py-2 text-sm flex gap-2 items-center"
              >
                <Plus size={16} /> Add Skill
              </button>
              <div className="grid sm:grid-cols-2 gap-4">
                {skills.map(skill => (
                  <div key={skill.id} className="glass-card p-4 space-y-3">
                    <input className="w-full bg-background/50 border border-primary/20 rounded p-2 text-sm" value={skill.name || ""} onChange={(e) => updateListItem("skills", skill.id, { name: e.target.value })} placeholder="Skill Name" />
                    <input className="w-full bg-background/50 border border-primary/20 rounded p-2 text-sm" value={skill.level || ""} onChange={(e) => updateListItem("skills", skill.id, { level: e.target.value })} placeholder="Level/Category" />
                    <button className="text-red-500 text-sm flex gap-1 items-center hover:opacity-80" onClick={() => deleteListItem("skills", skill.id)}><Trash2 size={14}/> Delete</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Section */}
          {activeTab === "projects" && (
            <div className="space-y-4">
              <button 
                onClick={() => addListItem("projects", { title: "New Project", subtitle: "", description: "", tech: "" })}
                className="neon-button-outline px-4 py-2 text-sm flex gap-2 items-center"
              >
                <Plus size={16} /> Add Project
              </button>
              <div className="space-y-4">
                {projects.map(proj => (
                  <div key={proj.id} className="glass-card p-4 space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input className="bg-background/50 border border-primary/20 rounded p-2 text-sm" value={proj.title || ""} onChange={(e) => updateListItem("projects", proj.id, { title: e.target.value })} placeholder="Title" />
                      <input className="bg-background/50 border border-primary/20 rounded p-2 text-sm" value={proj.subtitle || ""} onChange={(e) => updateListItem("projects", proj.id, { subtitle: e.target.value })} placeholder="Subtitle (e.g., E-Commerce)" />
                    </div>
                    <textarea rows={3} className="w-full bg-background/50 border border-primary/20 rounded p-2 text-sm" value={proj.description || ""} onChange={(e) => updateListItem("projects", proj.id, { description: e.target.value })} placeholder="Description" />
                    <input className="w-full bg-background/50 border border-primary/20 rounded p-2 text-sm" value={proj.tech || ""} onChange={(e) => updateListItem("projects", proj.id, { tech: e.target.value })} placeholder="Tech stack (comma separated)" />
                    <div className="grid sm:grid-cols-2 gap-3">
                       <input className="bg-background/50 border border-primary/20 rounded p-2 text-sm" value={proj.github || ""} onChange={(e) => updateListItem("projects", proj.id, { github: e.target.value })} placeholder="GitHub Link" />
                       <input className="bg-background/50 border border-primary/20 rounded p-2 text-sm" value={proj.demo || ""} onChange={(e) => updateListItem("projects", proj.id, { demo: e.target.value })} placeholder="Live Demo Link" />
                    </div>
                    <button className="text-red-500 text-sm flex gap-1 items-center hover:opacity-80" onClick={() => deleteListItem("projects", proj.id)}><Trash2 size={14}/> Delete</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements Section */}
          {activeTab === "achievements" && (
            <div className="space-y-4">
              <button 
                onClick={() => addListItem("achievements", { title: "New Item", subtitle: "", year: "", type: "education" })}
                className="neon-button-outline px-4 py-2 text-sm flex gap-2 items-center"
              >
                <Plus size={16} /> Add Item
              </button>
              <div className="space-y-4">
                {achievements.map(item => (
                  <div key={item.id} className="glass-card p-4 space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                       <input className="bg-background/50 border border-primary/20 rounded p-2 text-sm" value={item.title || ""} onChange={(e) => updateListItem("achievements", item.id, { title: e.target.value })} placeholder="Title (e.g. BCA, Certification Name)" />
                       <input className="bg-background/50 border border-primary/20 rounded p-2 text-sm" value={item.subtitle || ""} onChange={(e) => updateListItem("achievements", item.id, { subtitle: e.target.value })} placeholder="Subtitle (Institution / Body)" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                       <input className="bg-background/50 border border-primary/20 rounded p-2 text-sm" value={item.year || ""} onChange={(e) => updateListItem("achievements", item.id, { year: e.target.value })} placeholder="Year / Duration" />
                       <select className="bg-background/50 border border-primary/20 rounded p-2 text-sm" value={item.type || "education"} onChange={(e) => updateListItem("achievements", item.id, { type: e.target.value })}>
                          <option value="education">Education</option>
                          <option value="certification">Certification</option>
                          <option value="language">Language</option>
                       </select>
                    </div>
                    <button className="text-red-500 text-sm flex gap-1 items-center hover:opacity-80" onClick={() => deleteListItem("achievements", item.id)}><Trash2 size={14}/> Delete</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Section */}
          {activeTab === "contact" && (
            <div className="glass-card p-6 space-y-4">
              <div>
                <label className="block text-sm mb-1">Email</label>
                <input type="email" className="w-full bg-background/50 border border-primary/20 rounded p-2" value={contact.email || ""} onChange={e => setContact({...contact, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm mb-1">Phone</label>
                <input type="text" className="w-full bg-background/50 border border-primary/20 rounded p-2" value={contact.phone || ""} onChange={e => setContact({...contact, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm mb-1">LinkedIn URL</label>
                <input type="url" className="w-full bg-background/50 border border-primary/20 rounded p-2" value={contact.linkedin || ""} onChange={e => setContact({...contact, linkedin: e.target.value})} />
              </div>
               <div>
                <label className="block text-sm mb-1">GitHub URL (Optional)</label>
                <input type="url" className="w-full bg-background/50 border border-primary/20 rounded p-2" value={contact.github || ""} onChange={e => setContact({...contact, github: e.target.value})} />
              </div>
              <button className="neon-button px-4 py-2 text-sm" onClick={() => saveNode("contact", contact)}>Save Contact</button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
