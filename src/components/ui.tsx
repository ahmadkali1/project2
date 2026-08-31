"use client";

import { useId, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from "react";
import { AlertTriangle, ChevronLeft, ChevronRight, Inbox, RefreshCw, Search } from "lucide-react";
import type { DemoState } from "@/src/types";

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "quiet" | "danger";
}) {
  return (
    <button type="button" className={`button button--${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <header className="page-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </header>
  );
}

export function SearchInput({
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="search-field">
      <span className="sr-only">{label}</span>
      <Search aria-hidden="true" size={17} />
      <input type="search" {...props} />
    </label>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const tone = status.toLowerCase().replaceAll(" ", "-");
  return <span className={`status status--${tone}`}><span aria-hidden="true" />{status}</span>;
}

export function KpiCard({
  label,
  value,
  change,
  note,
  tone,
}: {
  label: string;
  value: string;
  change: string;
  note: string;
  tone: "sage" | "blue" | "gold" | "coral";
}) {
  return (
    <article className={`kpi kpi--${tone}`}>
      <div className="kpi-top">
        <span>{label}</span>
        <span className="kpi-change">{change}</span>
      </div>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  );
}

export function ChartCard({
  title,
  caption,
  action,
  children,
  className = "",
}: {
  title: string;
  caption: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const headingId = useId();
  return (
    <section className={`panel chart-card ${className}`} aria-labelledby={headingId}>
      <header className="panel-heading">
        <div><h2 id={headingId}>{title}</h2><p>{caption}</p></div>
        {action}
      </header>
      {children}
    </section>
  );
}

export function ChartDataTable({
  caption,
  headers,
  rows,
}: {
  caption: string;
  headers: string[];
  rows: Array<Array<string | number>>;
}) {
  return (
    <div className="sr-only">
      <table>
        <caption>{caption}</caption>
        <thead><tr>{headers.map((header) => <th key={header} scope="col">{header}</th>)}</tr></thead>
        <tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

export function Skeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="skeleton-stack" aria-label="Loading content" role="status">
      <span className="skeleton skeleton--heading" />
      {Array.from({ length: rows }, (_, index) => (
        <span className="skeleton" key={index} style={{ width: `${92 - index * 7}%` }} />
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export function EmptyState({
  title = "Nothing here yet",
  description = "There is no data to show for this view.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="state-card">
      <span className="state-icon"><Inbox aria-hidden="true" /></span>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export function ErrorState({ retry }: { retry: () => void }) {
  return (
    <div className="state-card state-card--error" role="alert">
      <span className="state-icon"><AlertTriangle aria-hidden="true" /></span>
      <h3>We couldn’t load this view</h3>
      <p>The demo hit a temporary error. Try the request again.</p>
      <Button onClick={retry} variant="secondary"><RefreshCw size={16} /> Retry</Button>
    </div>
  );
}

export function DataState({
  state,
  onRetry,
  emptyTitle,
  children,
}: {
  state: DemoState;
  onRetry: () => void;
  emptyTitle?: string;
  children: ReactNode;
}) {
  if (state === "loading") return <Skeleton rows={6} />;
  if (state === "error") return <ErrorState retry={onRetry} />;
  if (state === "empty") return <EmptyState title={emptyTitle} />;
  return <>{children}</>;
}

export function Pagination({
  page,
  pages,
  onPage,
}: {
  page: number;
  pages: number;
  onPage: (page: number) => void;
}) {
  return (
    <nav className="pagination" aria-label="Pagination">
      <Button variant="quiet" disabled={page === 1} onClick={() => onPage(page - 1)}>
        <ChevronLeft size={16} /> Previous
      </Button>
      <span>Page <strong>{page}</strong> of {pages}</span>
      <Button variant="quiet" disabled={page === pages} onClick={() => onPage(page + 1)}>
        Next <ChevronRight size={16} />
      </Button>
    </nav>
  );
}
