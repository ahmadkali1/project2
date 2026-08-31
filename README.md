# LumaDesk Commerce Dashboard

LumaDesk is a responsive React + TypeScript commerce dashboard built as a portfolio project for customers, orders, analytics, and workspace settings. The application focuses on clean information hierarchy, reusable UI, keyboard accessibility, meaningful demo interactions, and verifiable quality gates.

## Live Demo

[Open the hosted LumaDesk dashboard](https://lumadesk-dashboard.yaah618.chatgpt.site)

Demo credentials:

- Email: `ahmad@lumadesk.co`
- Password: `lumadesk`

> The repository uses client-side demo authentication for portfolio purposes. It demonstrates protected routes and session persistence, but it is not a replacement for server-side production authentication.

## Screenshots

### Login

![LumaDesk login page](public/screenshots/login.jpg)

### Dashboard — light theme

![LumaDesk dashboard in light theme](public/screenshots/dashboard-light.jpg)

### Dashboard — dark theme

![LumaDesk dashboard in dark theme](public/screenshots/dashboard-dark.jpg)

### Customers

![LumaDesk customers page](public/screenshots/customers.jpg)

## Features

- React 19 + TypeScript + React Router
- Protected dashboard routes with session/local demo authentication
- Login validation, loading feedback, password visibility control, and remembered sessions
- Dashboard KPIs, dynamic date/greeting, revenue trends, sales mix, recent orders, and activity
- Customer search, typed filters, sorting, pagination, details dialog, and functional add-customer flow
- Order search, typed fulfillment filters, sorting, pagination, details dialog, and functional create-order flow
- Analytics range controls, responsive Recharts visualizations, and CSV exports
- Workspace search, notifications, profile menu, logout, and persistent dark/light theme
- Settings powered by `react-hook-form` with values preserved between tabs and persisted to local storage
- Working appearance settings, reduced-motion preference, profile-photo preview, and demo password-change flow
- Reviewable loading, error, empty, and no-results states
- Responsive layout from 320px through large desktop displays

## Accessibility

The project includes accessibility as an implementation requirement rather than a README-only claim:

- Semantic page landmarks, headings, navigation, forms, tables, and regions
- Skip navigation on authenticated application pages
- Explicit form labels and connected validation messages
- Visible `:focus-visible` keyboard focus
- Keyboard-operable Settings tabs using the WAI-ARIA tabs pattern
- Accessible names for icon-only buttons and stateful controls
- Focus-managed Radix dialogs, menus, and mobile navigation drawer
- Mobile tables keep header semantics available to assistive technology
- Charts expose text/data alternatives while decorative chart SVGs are hidden from screen readers
- Status labels do not depend on color alone
- OS-level and user-selected reduced-motion support
- Responsive touch targets and keyboard-friendly pagination

## Functional Demo Actions

The portfolio demo intentionally uses local data, but visible controls perform real client-side actions instead of acting as dead buttons:

- Add a customer
- Create an order
- Export dashboard and analytics CSV reports
- Search workspace sections
- Open and mark notifications as read
- Navigate through the profile menu and log out
- Change and persist the active theme
- Save Settings values between tabs and reloads
- Preview a new profile image
- Change the demo password for the current browser session

## Data States

Use the **Demo state** selector in the top bar to review:

- Ready
- Loading skeleton
- Empty state
- Error state with retry

Customer and order searches also expose dedicated no-results states.

## Tech Stack

- React 19
- TypeScript
- React Router
- React Hook Form
- Recharts
- Radix UI primitives
- Sonner notifications
- Tailwind CSS foundation + custom CSS design system
- Vinext / Vite production runtime
- Node.js test runner
- ESLint
- GitHub Actions

## Routes

| Route | Purpose | Access |
| --- | --- | --- |
| `/login` | Demo sign-in and validation | Public |
| `/dashboard` | Commerce overview and KPIs | Protected |
| `/customers` | Customer management | Protected |
| `/orders` | Orders and fulfillment | Protected |
| `/analytics` | Reports and trends | Protected |
| `/settings` | Workspace preferences | Protected |

Unknown authenticated routes display a designed 404 view. Unauthenticated dashboard routes redirect to `/login` and return to the requested route after a successful sign-in.

## Run Locally

Requirements:

- Node.js 22.13 or newer

```bash
npm ci
npm run dev
```

Open the URL printed in the terminal.

## Quality Commands

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:smoke
```

Run every quality gate in order with:

```bash
npm run verify
```

The scripts are cross-platform npm/Node commands and no longer depend on GNU `timeout`, `flock`, or project-specific Bash wrappers.

## Testing

The test suite is focused on the application rather than unused starter components:

- Authentication validation behavior
- Dynamic dashboard greeting/date logic
- Customer filtering and sorting
- Order filtering and sorting
- CSV escaping/export data generation
- Loading/error state semantics
- Pagination state
- Accessible chart data alternatives
- Protected-route and Settings-tab accessibility contracts
- Mobile table header accessibility contract
- Production HTML smoke test after build

## Continuous Integration

`.github/workflows/ci.yml` runs on pushes and pull requests and verifies:

```text
npm ci
→ lint
→ typecheck
→ build
→ application tests
→ production smoke test
```

CI uses Node 22, npm dependency caching, read-only repository permissions, and a bounded job timeout.

## Project Structure

```text
.github/workflows/       CI quality gate
app/                     Hosting entry route and global design system
components/ui/           Only the Radix/shadcn primitives used by LumaDesk
src/
├── components/          Reusable application components and route guard
├── data/                Typed demo data
├── lib/                 Auth, filtering, dashboard, and CSV utilities
├── state/               Auth, theme, and demo-state contexts
├── views/               Routed application views
├── DashboardApp.tsx     Providers, router, and route composition
├── DashboardClient.tsx  Client runtime boundary
└── types.ts             Shared domain types
tests/                   Logic, accessibility, UI, and production smoke tests
public/screenshots/       Portfolio screenshots
```

Unused starter UI components, database examples, and unrelated template dependencies have been removed so the repository reflects the application that is actually shipped.

## Deployment

The existing hosting adapter supports the published demo and direct route refreshes. For a new deployment, install dependencies, run `npm run verify`, then deploy the generated production build with the same hosting adapter or another compatible React/Vite host.

## Security Scope

LumaDesk uses local demo data and client-side route protection because it is a frontend portfolio application. A production commerce product should replace this layer with server-validated sessions, authorization, secure cookies, a real database/API, CSRF protections where applicable, and server-side input validation.

## Git History

This handoff contains a clean three-commit history with meaningful commit messages:

```text
chore: import LumaDesk portfolio dashboard
feat: harden dashboard interactions and accessibility
chore: add verification, CI, tests, and repository cleanup
```
