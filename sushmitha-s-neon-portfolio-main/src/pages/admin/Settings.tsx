import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ref, get, update } from "firebase/database";
import { db } from "../../firebase";
import { ArrowLeft, Key, User } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmin = async () => {
      const adminRef = ref(db, "admin");
      const snapshot = await get(adminRef);
      if (snapshot.exists()) {
        setUsername(snapshot.val().username);
        setPassword(snapshot.val().password);
      }
    };
    fetchAdmin();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const adminRef = ref(db, "admin");
      await update(adminRef, {
        username,
        password,
      });
      toast.success("Settings updated successfully");
    } catch (error) {
      toast.error("Failed to update settings");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin/dashboard" className="p-2 hover:bg-muted rounded-full transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-heading font-bold">Admin Settings</h1>
          </div>
          <button onClick={handleLogout} className="neon-button-outline px-4 py-2 text-sm">
            Logout
          </button>
        </div>

        <div className="glass-card p-6 md:p-8">
          <form onSubmit={handleUpdate} className="space-y-6 max-w-md">
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-background/50 border border-primary/20 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-primary transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background/50 border border-primary/20 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-primary transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="neon-button px-6 py-2.5 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
