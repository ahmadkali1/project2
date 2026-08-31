"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { DEMO_EMAIL, DEMO_PASSWORD, DEMO_PASSWORD_SESSION_KEY, validateDemoLogin, type LoginErrors } from "@/src/lib/auth";
import { useAuth } from "@/src/state/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [demoPassword] = useState(() => window.sessionStorage.getItem(DEMO_PASSWORD_SESSION_KEY) ?? DEMO_PASSWORD);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const remember = form.get("remember") === "on";
    const nextErrors: LoginErrors = validateDemoLogin(email, password, demoPassword);

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    window.setTimeout(() => {
      signIn(remember);
      const destination = typeof location.state === "object" && location.state && "from" in location.state
        ? String(location.state.from)
        : "/dashboard";
      navigate(destination, { replace: true });
    }, 450);
  }

  return (
    <main className="login-page" id="main-content">
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

      <section className="login-form-wrap" aria-labelledby="login-heading">
        <form className="login-form" onSubmit={submit} noValidate>
          <div>
            <p className="eyebrow">Welcome back</p>
            <h2 id="login-heading">Sign in to your workspace</h2>
            <p>Use the demo details below to enter the protected dashboard.</p>
          </div>

          <div className="form-field">
            <label htmlFor="login-email">Email address</label>
            <div className={"input-with-icon " + (errors.email ? "invalid" : "")}>
              <Mail aria-hidden="true" size={18} />
              <input id="login-email" name="email" type="email" defaultValue={DEMO_EMAIL} autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} />
            </div>
            {errors.email && <small className="field-error" id="email-error">{errors.email}</small>}
          </div>

          <div className="form-field">
            <label htmlFor="login-password">Password</label>
            <div className={"input-with-icon " + (errors.password ? "invalid" : "")}>
              <LockKeyhole aria-hidden="true" size={18} />
              <input id="login-password" name="password" type={showPassword ? "text" : "password"} defaultValue={demoPassword} autoComplete="current-password" aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "password-error" : undefined} />
              <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword}>
                {showPassword ? <EyeOff aria-hidden="true" size={18} /> : <Eye aria-hidden="true" size={18} />}
              </button>
            </div>
            {errors.password && <small className="field-error" id="password-error">{errors.password}</small>}
          </div>

          <div className="login-options">
            <label><input type="checkbox" name="remember" /> Remember me</label>
            <a href="#demo-note">Forgot password?</a>
          </div>

          {errors.form && <p className="field-error form-error" role="alert">{errors.form}</p>}
          <button className="login-submit" type="submit" disabled={loading} aria-busy={loading}>
            {loading ? "Opening workspace…" : <>Sign in <ArrowRight aria-hidden="true" size={18} /></>}
          </button>
          <p className="demo-note" id="demo-note"><strong>Demo:</strong> {DEMO_EMAIL} · {demoPassword}</p>
        </form>
      </section>
    </main>
  );
}
