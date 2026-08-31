"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useNavigate } from "react-router";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const nextErrors: typeof errors = {};
    if (!email.includes("@")) nextErrors.email = "Enter a valid email address.";
    if (password.length < 6) nextErrors.password = "Password must contain at least 6 characters.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setLoading(true);
    window.setTimeout(() => navigate("/dashboard"), 700);
  }

  return (
    <main className="login-page">
      <section className="login-story" aria-label="LumaDesk introduction">
        <div className="brand login-brand"><span className="brand-mark">L</span><strong>LumaDesk</strong></div>
        <div className="login-story-copy">
          <p className="eyebrow">Commerce, without the clutter</p>
          <h1>Make room for the decisions that matter.</h1>
          <p>One calm workspace for customers, orders, and the signals behind your next move.</p>
        </div>
        <div className="login-note">
          <span>Today’s pulse</span>
          <strong>$46,820</strong>
          <small>Revenue is 12.4% ahead of last month</small>
          <div className="mini-bars" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
        </div>
        <p className="login-foot">Built for focused commerce teams.</p>
      </section>

      <section className="login-form-wrap">
        <form className="login-form" onSubmit={submit} noValidate>
          <div>
            <p className="eyebrow">Welcome back</p>
            <h2>Sign in to your workspace</h2>
            <p>Use the demo details below, or any valid email and password.</p>
          </div>

          <label className="form-field">
            <span>Email address</span>
            <div className={"input-with-icon " + (errors.email ? "invalid" : "")}>
              <Mail aria-hidden="true" size={18} />
              <input name="email" type="email" defaultValue="ahmad@lumadesk.co" autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} />
            </div>
            {errors.email && <small className="field-error" id="email-error">{errors.email}</small>}
          </label>

          <label className="form-field">
            <span>Password</span>
            <div className={"input-with-icon " + (errors.password ? "invalid" : "")}>
              <LockKeyhole aria-hidden="true" size={18} />
              <input name="password" type={showPassword ? "text" : "password"} defaultValue="lumadesk" autoComplete="current-password" aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "password-error" : undefined} />
              <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff aria-hidden="true" size={18} /> : <Eye aria-hidden="true" size={18} />}
              </button>
            </div>
            {errors.password && <small className="field-error" id="password-error">{errors.password}</small>}
          </label>

          <div className="login-options">
            <label><input type="checkbox" name="remember" /> Remember me</label>
            <a href="#demo-note">Forgot password?</a>
          </div>

          <button className="login-submit" type="submit" disabled={loading}>
            {loading ? "Opening workspace…" : <>Sign in <ArrowRight aria-hidden="true" size={18} /></>}
          </button>
          <p className="demo-note" id="demo-note"><strong>Demo:</strong> ahmad@lumadesk.co · lumadesk</p>
        </form>
      </section>
    </main>
  );
}
