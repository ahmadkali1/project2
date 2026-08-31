"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
} from "react";
import { useForm, useWatch } from "react-hook-form";
import { Bell, Building2, Check, Globe2, LockKeyhole, Palette, UserRound } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, DataState, PageHeader } from "@/src/components/ui";
import { DEMO_PASSWORD, DEMO_PASSWORD_SESSION_KEY } from "@/src/lib/auth";
import { useDemoState } from "@/src/state/DemoContext";
import { useTheme, type Theme } from "@/src/state/ThemeContext";

const SETTINGS_STORAGE_KEY = "lumadesk-settings";

type SettingsTab = "profile" | "business" | "notifications" | "appearance" | "regional" | "security";

type SettingsFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  businessName: string;
  industry: "retail" | "creative" | "services";
  teamSize: "solo" | "small" | "medium";
  businessAddress: string;
  notifyNewOrders: boolean;
  notifyPaymentIssues: boolean;
  notifyWeeklySummary: boolean;
  notifyProductUpdates: boolean;
  theme: Theme;
  reducedMotion: boolean;
  language: "en" | "ar";
  timeZone: "dubai" | "amman" | "london";
  currency: "usd" | "aed" | "eur";
  dateFormat: "long" | "short";
  twoFactor: boolean;
  loginAlerts: boolean;
};

const baseDefaults: SettingsFormValues = {
  firstName: "Ahmad",
  lastName: "Kali",
  email: "ahmad@lumadesk.co",
  role: "Administrator",
  businessName: "LumaDesk Studio",
  industry: "retail",
  teamSize: "small",
  businessAddress: "Dubai, United Arab Emirates",
  notifyNewOrders: true,
  notifyPaymentIssues: true,
  notifyWeeklySummary: true,
  notifyProductUpdates: false,
  theme: "light",
  reducedMotion: false,
  language: "en",
  timeZone: "dubai",
  currency: "usd",
  dateFormat: "long",
  twoFactor: true,
  loginAlerts: true,
};

export function loadSettings(): SettingsFormValues {
  try {
    const saved = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    return saved ? { ...baseDefaults, ...JSON.parse(saved) } : baseDefaults;
  } catch {
    return baseDefaults;
  }
}

const tabs: Array<{ id: SettingsTab; label: string; icon: typeof UserRound }> = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "business", label: "Business", icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "regional", label: "Regional", icon: Globe2 },
  { id: "security", label: "Security", icon: LockKeyhole },
];

function SwitchRow({ title, description, inputProps }: {
  title: string;
  description: string;
  inputProps: InputHTMLAttributes<HTMLInputElement>;
}) {
  return (
    <label className="switch-row">
      <span><strong>{title}</strong><small>{description}</small></span>
      <input className="switch-input" type="checkbox" {...inputProps} />
    </label>
  );
}

function PasswordDialog({ onChanged }: { onChanged: () => void }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const current = String(form.get("currentPassword") ?? "");
    const next = String(form.get("newPassword") ?? "");
    const confirm = String(form.get("confirmPassword") ?? "");

    const expected = window.sessionStorage.getItem(DEMO_PASSWORD_SESSION_KEY) ?? DEMO_PASSWORD;
    if (current !== expected) return setError("The current demo password is incorrect.");
    if (next.length < 12) return setError("Use at least 12 characters for the new password.");
    if (next !== confirm) return setError("The new passwords do not match.");

    window.sessionStorage.setItem(DEMO_PASSWORD_SESSION_KEY, next);
    setError("");
    setOpen(false);
    onChanged();
    toast.success("Demo password updated for this browser session");
  }

  return (
    <Dialog open={open} onOpenChange={(next) => { setOpen(next); if (!next) setError(""); }}>
      <DialogTrigger asChild><Button type="button" variant="secondary">Change password</Button></DialogTrigger>
      <DialogContent className="details-dialog">
        <DialogHeader>
          <DialogTitle>Change demo password</DialogTitle>
          <DialogDescription>The new demo password will be used until this browser session ends.</DialogDescription>
        </DialogHeader>
        <form className="dialog-form" onSubmit={changePassword}>
          <label className="form-field"><span>Current password</span><input name="currentPassword" type="password" autoComplete="current-password" required /></label>
          <label className="form-field"><span>New password</span><input name="newPassword" type="password" autoComplete="new-password" minLength={12} required /></label>
          <label className="form-field"><span>Confirm new password</span><input name="confirmPassword" type="password" autoComplete="new-password" minLength={12} required /></label>
          {error && <p className="field-error" role="alert">{error}</p>}
          <Button type="submit">Update password</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function SettingsPage() {
  const { demoState, setDemoState } = useDemoState();
  const { theme, setTheme } = useTheme();
  const [tab, setTab] = useState<SettingsTab>("profile");
  const [saved, setSaved] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { isDirty, errors },
  } = useForm<SettingsFormValues>({
    defaultValues: () => Promise.resolve({ ...loadSettings(), theme }),
    mode: "onChange",
  });

  const reducedMotion = useWatch({ control, name: "reducedMotion" });

  useEffect(() => {
    setValue("theme", theme, { shouldDirty: false });
  }, [setValue, theme]);

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = reducedMotion ? "true" : "false";
  }, [reducedMotion]);

  useEffect(() => () => {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
  }, [avatarPreview]);

  function save(values: SettingsFormValues) {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(values));
    reset(values);
    setSaved(true);
    toast.success("Settings saved");
    window.setTimeout(() => setSaved(false), 3000);
  }

  function selectTab(next: SettingsTab) {
    setTab(next);
    setSaved(false);
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let target = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") target = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") target = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") target = 0;
    else if (event.key === "End") target = tabs.length - 1;
    else return;

    event.preventDefault();
    const next = tabs[target];
    selectTab(next.id);
    tabRefs.current[target]?.focus();
  }

  function changePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Choose a JPG or PNG image");
      event.target.value = "";
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be 2MB or smaller");
      event.target.value = "";
      return;
    }
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(URL.createObjectURL(file));
    toast.success("Profile photo preview updated");
  }

  const themeField = register("theme");

  return (
    <>
      <PageHeader eyebrow="Workspace preferences" title="Settings" description="Shape LumaDesk around the way your team works." />
      <DataState state={demoState} onRetry={() => setDemoState("ready")} emptyTitle="No settings are available">
        <div className="settings-layout">
          <div className="settings-nav" role="tablist" aria-label="Settings sections" aria-orientation="vertical">
            {tabs.map(({ id, label, icon: Icon }, index) => (
              <button
                key={id}
                ref={(node) => { tabRefs.current[index] = node; }}
                type="button"
                role="tab"
                id={`settings-tab-${id}`}
                aria-controls={`settings-panel-${id}`}
                aria-selected={tab === id}
                tabIndex={tab === id ? 0 : -1}
                className={tab === id ? "active" : ""}
                onClick={() => selectTab(id)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
              >
                <Icon size={17} aria-hidden="true" />{label}
              </button>
            ))}
          </div>

          <form className="panel settings-panel" onSubmit={handleSubmit(save)} noValidate>
            <section role="tabpanel" tabIndex={0} id="settings-panel-profile" aria-labelledby="settings-tab-profile" hidden={tab !== "profile"}>
                <header><h2>Profile information</h2><p>How you appear across the LumaDesk workspace.</p></header>
                <div className="profile-edit">
                  {avatarPreview ? <span className="avatar avatar--xlarge avatar-image" role="img" aria-label="New profile preview" style={{ backgroundImage: `url(${avatarPreview})` }} /> : <span className="avatar avatar--xlarge" aria-hidden="true">AK</span>}
                  <div>
                    <input ref={fileRef} hidden type="file" accept="image/jpeg,image/png" onChange={changePhoto} />
                    <Button type="button" variant="secondary" onClick={() => fileRef.current?.click()}>Change photo</Button>
                    <small>JPG or PNG, up to 2MB.</small>
                  </div>
                </div>
                <div className="form-grid">
                  <label className="form-field"><span>First name</span><input {...register("firstName", { required: "First name is required." })} aria-invalid={Boolean(errors.firstName)} />{errors.firstName && <small className="field-error">{errors.firstName.message}</small>}</label>
                  <label className="form-field"><span>Last name</span><input {...register("lastName", { required: "Last name is required." })} aria-invalid={Boolean(errors.lastName)} />{errors.lastName && <small className="field-error">{errors.lastName.message}</small>}</label>
                  <label className="form-field form-span"><span>Email</span><input type="email" {...register("email", { required: "Email is required.", pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email." } })} aria-invalid={Boolean(errors.email)} />{errors.email && <small className="field-error">{errors.email.message}</small>}</label>
                  <label className="form-field form-span"><span>Role</span><input {...register("role")} /></label>
                </div>
            </section>

            <section role="tabpanel" tabIndex={0} id="settings-panel-business" aria-labelledby="settings-tab-business" hidden={tab !== "business"}>
                <header><h2>Business information</h2><p>Details used in reports and customer documents.</p></header>
                <div className="form-grid">
                  <label className="form-field form-span"><span>Business name</span><input {...register("businessName", { required: true })} /></label>
                  <label className="form-field"><span>Industry</span><select {...register("industry")}><option value="retail">Retail & commerce</option><option value="creative">Creative studio</option><option value="services">Professional services</option></select></label>
                  <label className="form-field"><span>Team size</span><select {...register("teamSize")}><option value="solo">Just me</option><option value="small">2–10 people</option><option value="medium">11–50 people</option></select></label>
                  <label className="form-field form-span"><span>Business address</span><input {...register("businessAddress")} /></label>
                </div>
            </section>

            <section role="tabpanel" tabIndex={0} id="settings-panel-notifications" aria-labelledby="settings-tab-notifications" hidden={tab !== "notifications"}>
                <header><h2>Notifications</h2><p>Choose the signals that deserve your attention.</p></header>
                <div className="switch-list">
                  <SwitchRow title="New orders" description="Notify me when a new order is placed." inputProps={register("notifyNewOrders")} />
                  <SwitchRow title="Payment issues" description="Notify me when a payment fails or needs review." inputProps={register("notifyPaymentIssues")} />
                  <SwitchRow title="Weekly summary" description="Send a quiet Monday performance digest." inputProps={register("notifyWeeklySummary")} />
                  <SwitchRow title="Product updates" description="Occasional notes about new LumaDesk features." inputProps={register("notifyProductUpdates")} />
                </div>
            </section>

            <section role="tabpanel" tabIndex={0} id="settings-panel-appearance" aria-labelledby="settings-tab-appearance" hidden={tab !== "appearance"}>
                <header><h2>Appearance</h2><p>Choose a comfortable working environment.</p></header>
                <fieldset className="theme-options">
                  <legend>Color theme</legend>
                  <label><input {...themeField} type="radio" value="light" checked={theme === "light"} onChange={(event) => { themeField.onChange(event); setTheme("light"); }} /><span className="theme-preview theme-preview--light" /><strong>Warm light</strong><small>Soft canvas and ink.</small></label>
                  <label><input {...themeField} type="radio" value="dark" checked={theme === "dark"} onChange={(event) => { themeField.onChange(event); setTheme("dark"); }} /><span className="theme-preview theme-preview--dark" /><strong>Deep evening</strong><small>Low-glare dark surfaces.</small></label>
                </fieldset>
                <SwitchRow title="Reduced motion" description="Keep interface transitions to a minimum." inputProps={register("reducedMotion")} />
            </section>

            <section role="tabpanel" tabIndex={0} id="settings-panel-regional" aria-labelledby="settings-tab-regional" hidden={tab !== "regional"}>
                <header><h2>Regional preferences</h2><p>Control how dates, money, and time appear.</p></header>
                <div className="form-grid">
                  <label className="form-field"><span>Language</span><select {...register("language")}><option value="en">English</option><option value="ar">Arabic</option></select></label>
                  <label className="form-field"><span>Time zone</span><select {...register("timeZone")}><option value="dubai">Dubai (GMT+4)</option><option value="amman">Amman (GMT+3)</option><option value="london">London (GMT+1)</option></select></label>
                  <label className="form-field"><span>Currency</span><select {...register("currency")}><option value="usd">USD — US Dollar</option><option value="aed">AED — UAE Dirham</option><option value="eur">EUR — Euro</option></select></label>
                  <label className="form-field"><span>Date format</span><select {...register("dateFormat")}><option value="long">Aug 31, 2026</option><option value="short">31/08/2026</option></select></label>
                </div>
            </section>

            <section role="tabpanel" tabIndex={0} id="settings-panel-security" aria-labelledby="settings-tab-security" hidden={tab !== "security"}>
                <header><h2>Security</h2><p>Protect your workspace and active sessions.</p></header>
                <div className="switch-list">
                  <SwitchRow title="Two-factor authentication" description="Require a verification code when signing in." inputProps={register("twoFactor")} />
                  <SwitchRow title="Login alerts" description="Email me when a new device signs in." inputProps={register("loginAlerts")} />
                </div>
                <div className="security-note"><LockKeyhole size={20} aria-hidden="true" /><div><strong>{passwordChanged ? "Password changed just now" : "Password last changed 42 days ago"}</strong><p>Use a unique password with at least 12 characters.</p><PasswordDialog onChanged={() => setPasswordChanged(true)} /></div></div>
            </section>

            <footer className="settings-footer">
              <p aria-live="polite">{saved ? <span className="saved-message"><Check aria-hidden="true" size={16} /> Changes saved</span> : isDirty ? "You have unsaved changes." : "Everything is up to date."}</p>
              <Button type="submit" disabled={!isDirty}>Save changes</Button>
            </footer>
          </form>
        </div>
      </DataState>
    </>
  );
}
