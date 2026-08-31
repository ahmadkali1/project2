export const DEMO_EMAIL = "ahmad@lumadesk.co";
export const DEMO_PASSWORD = "lumadesk";
export const DEMO_PASSWORD_SESSION_KEY = "lumadesk-demo-password";

export type LoginErrors = { email?: string; password?: string; form?: string };

export function validateDemoLogin(emailValue: string, password: string, expectedPassword = DEMO_PASSWORD): LoginErrors {
  const email = emailValue.trim();
  const errors: LoginErrors = {};
  if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Enter a valid email address.";
  if (password.length < 6) errors.password = "Password must contain at least 6 characters.";
  if (!errors.email && !errors.password && (email !== DEMO_EMAIL || password !== expectedPassword)) {
    errors.form = "Use the demo email and password shown below.";
  }
  return errors;
}
