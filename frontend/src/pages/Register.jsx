import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import AuthLayout from "../components/auth/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../api/client";

export default function Register() {
  const { registerAccount } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!form.username.trim()) nextErrors.username = "Choose a username.";
    else if (form.username.trim().length < 3) nextErrors.username = "Use at least 3 characters.";
    if (!form.password) nextErrors.password = "Choose a password.";
    else if (form.password.length < 6) nextErrors.password = "Use at least 6 characters.";
    if (form.confirm !== form.password) nextErrors.confirm = "Passwords don't match.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      await registerAccount(form.username.trim(), form.password);
      toast.success("Studio account created.");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't create your account. That username may be taken."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Set up your studio"
      subtitle="One account for the studio, poster lab, voice lab, and assistant."
      footer={
        <>
          Already have an account? <Link to="/login">Sign in</Link>
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
            autoComplete="new-password"
            placeholder="At least 6 characters"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />
          <Input
            label="Confirm password"
            name="confirm"
            type="password"
            autoComplete="new-password"
            placeholder="Type it again"
            value={form.confirm}
            onChange={handleChange}
            error={errors.confirm}
          />
          <Button type="submit" size="lg" loading={loading} icon={<UserPlus size={16} />} style={{ marginTop: 6 }}>
            Create account
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
