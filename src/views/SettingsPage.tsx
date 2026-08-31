"use client";

import { useState, type FormEvent } from "react";
import { Bell, Building2, Check, Globe2, LockKeyhole, Palette, UserRound } from "lucide-react";
import { Button, DataState, PageHeader } from "@/src/components/ui";
import { useDemoState } from "@/src/state/DemoContext";

const tabs = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "business", label: "Business", icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "regional", label: "Regional", icon: Globe2 },
  { id: "security", label: "Security", icon: LockKeyhole },
];

function SwitchRow({ title, description, defaultChecked = false }: { title: string; description: string; defaultChecked?: boolean }) {
  return (
    <label className="switch-row">
      <span><strong>{title}</strong><small>{description}</small></span>
      <input className="switch-input" type="checkbox" defaultChecked={defaultChecked} />
    </label>
  );
}

export default function SettingsPage() {
  const { demoState, setDemoState } = useDemoState();
  const [tab, setTab] = useState("profile");
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
    setDirty(false);
    window.setTimeout(() => setSaved(false), 3000);
  }

  return (
    <>
      <PageHeader eyebrow="Workspace preferences" title="Settings" description="Shape LumaDesk around the way your team works." />
      <DataState state={demoState} onRetry={() => setDemoState("ready")} emptyTitle="No settings are available">
        <div className="settings-layout">
          <nav className="settings-nav" aria-label="Settings sections">
            {tabs.map(({ id, label, icon: Icon }) => <button key={id} className={tab === id ? "active" : ""} onClick={() => { setTab(id); setSaved(false); }}><Icon size={17} aria-hidden="true" />{label}</button>)}
          </nav>
          <form className="panel settings-panel" onSubmit={save} onChange={() => setDirty(true)}>
            {tab === "profile" && <section>
              <header><h2>Profile information</h2><p>How you appear across the LumaDesk workspace.</p></header>
              <div className="profile-edit"><span className="avatar avatar--xlarge">AK</span><div><Button type="button" variant="secondary">Change photo</Button><small>JPG or PNG, up to 2MB.</small></div></div>
              <div className="form-grid"><label className="form-field"><span>First name</span><input defaultValue="Ahmad" required /></label><label className="form-field"><span>Last name</span><input defaultValue="Kali" required /></label><label className="form-field form-span"><span>Email</span><input type="email" defaultValue="ahmad@lumadesk.co" required /></label><label className="form-field form-span"><span>Role</span><input defaultValue="Administrator" /></label></div>
            </section>}
            {tab === "business" && <section>
              <header><h2>Business information</h2><p>Details used in reports and customer documents.</p></header>
              <div className="form-grid"><label className="form-field form-span"><span>Business name</span><input defaultValue="LumaDesk Studio" required /></label><label className="form-field"><span>Industry</span><select defaultValue="retail"><option value="retail">Retail & commerce</option><option value="creative">Creative studio</option><option value="services">Professional services</option></select></label><label className="form-field"><span>Team size</span><select defaultValue="small"><option value="solo">Just me</option><option value="small">2–10 people</option><option value="medium">11–50 people</option></select></label><label className="form-field form-span"><span>Business address</span><input defaultValue="Dubai, United Arab Emirates" /></label></div>
            </section>}
            {tab === "notifications" && <section>
              <header><h2>Notifications</h2><p>Choose the signals that deserve your attention.</p></header>
              <div className="switch-list"><SwitchRow title="New orders" description="Notify me when a new order is placed." defaultChecked /><SwitchRow title="Payment issues" description="Notify me when a payment fails or needs review." defaultChecked /><SwitchRow title="Weekly summary" description="Send a quiet Monday performance digest." defaultChecked /><SwitchRow title="Product updates" description="Occasional notes about new LumaDesk features." /></div>
            </section>}
            {tab === "appearance" && <section>
              <header><h2>Appearance</h2><p>Choose a comfortable working environment.</p></header>
              <fieldset className="theme-options"><legend>Color theme</legend><label><input type="radio" name="theme" defaultChecked /><span className="theme-preview theme-preview--light" /><strong>Warm light</strong><small>Soft canvas and ink.</small></label><label><input type="radio" name="theme" /><span className="theme-preview theme-preview--dark" /><strong>Deep evening</strong><small>Low-glare dark surfaces.</small></label></fieldset>
              <SwitchRow title="Reduced motion" description="Keep interface transitions to a minimum." />
            </section>}
            {tab === "regional" && <section>
              <header><h2>Regional preferences</h2><p>Control how dates, money, and time appear.</p></header>
              <div className="form-grid"><label className="form-field"><span>Language</span><select defaultValue="en"><option value="en">English</option><option value="ar">Arabic</option></select></label><label className="form-field"><span>Time zone</span><select defaultValue="dubai"><option value="dubai">Dubai (GMT+4)</option><option value="amman">Amman (GMT+3)</option><option value="london">London (GMT+1)</option></select></label><label className="form-field"><span>Currency</span><select defaultValue="usd"><option value="usd">USD — US Dollar</option><option value="aed">AED — UAE Dirham</option><option value="eur">EUR — Euro</option></select></label><label className="form-field"><span>Date format</span><select defaultValue="long"><option value="long">Aug 31, 2026</option><option value="short">31/08/2026</option></select></label></div>
            </section>}
            {tab === "security" && <section>
              <header><h2>Security</h2><p>Protect your workspace and active sessions.</p></header>
              <div className="switch-list"><SwitchRow title="Two-factor authentication" description="Require a verification code when signing in." defaultChecked /><SwitchRow title="Login alerts" description="Email me when a new device signs in." defaultChecked /></div>
              <div className="security-note"><LockKeyhole size={20} aria-hidden="true" /><div><strong>Password last changed 42 days ago</strong><p>Use a unique password with at least 12 characters.</p><Button type="button" variant="secondary">Change password</Button></div></div>
            </section>}

            <footer className="settings-footer">
              <p aria-live="polite">{saved ? <span className="saved-message"><Check size={16} /> Changes saved</span> : dirty ? "You have unsaved changes." : "Everything is up to date."}</p>
              <Button type="submit" disabled={!dirty}>Save changes</Button>
            </footer>
          </form>
        </div>
      </DataState>
    </>
  );
}
