import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({
  appType: "custom",
  configFile: false,
  root,
  resolve: { alias: { "@": root } },
  server: { middlewareMode: true },
});

after(async () => vite.close());

test("chart data table exposes a complete text alternative", async () => {
  const { ChartDataTable } = await vite.ssrLoadModule("/src/components/ui.tsx");
  const html = renderToStaticMarkup(React.createElement(ChartDataTable, {
    caption: "Revenue by month",
    headers: ["Month", "Revenue"],
    rows: [["Aug", "$46,820"]],
  }));
  assert.match(html, /<caption>Revenue by month<\/caption>/);
  assert.match(html, /scope="col">Month/);
  assert.match(html, /\$46,820/);
});

test("loading and error states expose status semantics", async () => {
  const { DataState } = await vite.ssrLoadModule("/src/components/ui.tsx");
  const loading = renderToStaticMarkup(React.createElement(DataState, {
    state: "loading",
    onRetry() {},
    children: React.createElement("span", null, "ready"),
  }));
  const error = renderToStaticMarkup(React.createElement(DataState, {
    state: "error",
    onRetry() {},
    children: React.createElement("span", null, "ready"),
  }));
  assert.match(loading, /role="status"/);
  assert.match(error, /role="alert"/);
});

test("pagination disables unavailable directions", async () => {
  const { Pagination } = await vite.ssrLoadModule("/src/components/ui.tsx");
  const html = renderToStaticMarkup(React.createElement(Pagination, { page: 1, pages: 3, onPage() {} }));
  assert.match(html, /aria-label="Pagination"/);
  assert.match(html, /disabled=""[^>]*>.*Previous/);
  assert.doesNotMatch(html, /disabled=""[^>]*>.*Next/);
});
