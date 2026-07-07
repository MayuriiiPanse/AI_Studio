import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import toast from "react-hot-toast";
import AuthLayout from "../components/auth/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../api/client";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!form.username.trim()) nextErrors.username = "Enter your username.";
    if (!form.password) nextErrors.password = "Enter your password.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      await login(form.username.trim(), form.password);
      toast.success("Welcome back.");
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't sign you in. Check your details and try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in to your studio"
      subtitle="Pick up right where your last release left off."
      footer={
        <>
          New to Reelcraft? <Link to="/register">Create an account</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input
            label="Username"
            name="username"
            autoComplete="username"
            placeholder="yourname"
            value={form.username}
            onChange={handleChange}
            error={errors.username}
            autoFocus
          />
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />
          <Button type="submit" size="lg" loading={loading} icon={<LogIn size={16} />} style={{ marginTop: 6 }}>
            Sign in
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
