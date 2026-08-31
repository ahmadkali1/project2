import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("login main target and password control have explicit semantics", async () => {
  const source = await read("src/views/LoginPage.tsx");
  assert.match(source, /id="main-content"/);
  assert.match(source, /label htmlFor="login-password"/);
  assert.match(source, /id="login-password"/);
  assert.match(source, /aria-pressed=\{showPassword\}/);
});

test("protected routes require authentication", async () => {
  const app = await read("src/DashboardApp.tsx");
  const guard = await read("src/components/ProtectedRoute.tsx");
  assert.match(app, /<ProtectedRoute>/);
  assert.match(guard, /<Navigate to="\/login" replace/);
});

test("settings use the WAI-ARIA tabs contract", async () => {
  const source = await read("src/views/SettingsPage.tsx");
  assert.match(source, /role="tablist"/);
  assert.match(source, /role="tab"/);
  assert.match(source, /aria-selected=\{tab === id\}/);
  assert.match(source, /role="tabpanel"/);
  assert.match(source, /hidden=\{tab !== "profile"\}/);
  assert.match(source, /hidden=\{tab !== "security"\}/);
  assert.match(source, /ArrowRight/);
  assert.match(source, /ArrowLeft/);
});


test("settings preserve form values instead of remounting defaultValue inputs", async () => {
  const source = await read("src/views/SettingsPage.tsx");
  assert.match(source, /useForm<SettingsFormValues>/);
  assert.match(source, /register\("firstName"/);
  assert.doesNotMatch(source, /<input[^>]*defaultValue=/);
  assert.match(source, /localStorage\.setItem\(SETTINGS_STORAGE_KEY/);
});

test("mobile tables keep headers available to assistive technology", async () => {
  const css = await read("app/globals.css");
  const mobileHeaderRule = css.match(/\.customer-table thead, \.order-table thead \{([\s\S]*?)\}/)?.[1] ?? "";
  assert.ok(mobileHeaderRule);
  assert.doesNotMatch(mobileHeaderRule, /display:\s*none/);
  assert.match(mobileHeaderRule, /clip:\s*rect/);
});

test("charts include accessible data alternatives", async () => {
  const dashboard = await read("src/views/DashboardPage.tsx");
  const analytics = await read("src/views/AnalyticsPage.tsx");
  assert.match(dashboard, /<ChartDataTable/);
  assert.match(analytics, /<ChartDataTable/g);
  assert.match(dashboard, /aria-hidden="true"/);
  assert.match(analytics, /aria-hidden="true"/);
});
