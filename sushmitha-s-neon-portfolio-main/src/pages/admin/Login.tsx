import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ref, get, set } from "firebase/database";
import { db } from "../../firebase";
import { Lock, User } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-create default admin if not exists
    const checkAdmin = async () => {
      const adminRef = ref(db, "admin");
      const snapshot = await get(adminRef);
      if (!snapshot.exists()) {
        await set(adminRef, {
          username: "admin",
          password: "admin123",
        });
      }
    };
    checkAdmin();
    
    // Redirect if already logged in
    if (localStorage.getItem("adminAuth") === "true") {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const adminRef = ref(db, "admin");
      const snapshot = await get(adminRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (data.username === username && data.password === password) {
          localStorage.setItem("adminAuth", "true");
          toast.success("Login successful");
          navigate("/admin/dashboard");
        } else {
          toast.error("Invalid credentials");
        }
      } else {
        toast.error("Admin account not found");
      }
    } catch (error) {
      toast.error("An error occurred during login");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background z-0" />
      
      <div className="z-10 w-full max-w-md p-8 rounded-2xl glass-card border border-primary/20 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Sign in to manage your portfolio</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-background/50 border border-primary/20 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-primary transition-colors"
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background/50 border border-primary/20 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-primary transition-colors"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full neon-button py-3 mt-4 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
