import assert from "node:assert/strict";
import test from "node:test";
import { DEMO_EMAIL, DEMO_PASSWORD, validateDemoLogin } from "../src/lib/auth.ts";
import { filterAndSortCustomers, filterAndSortOrders } from "../src/lib/collections.ts";
import { getDashboardHeader } from "../src/lib/dashboard.ts";
import { buildCsv } from "../src/lib/export.ts";

test("dashboard greeting and date are derived from the supplied time", () => {
  assert.deepEqual(getDashboardHeader(new Date("2026-08-31T08:00:00")), {
    greeting: "Good morning",
    eyebrow: "Monday · August 31",
  });
  assert.equal(getDashboardHeader(new Date("2026-08-31T14:00:00")).greeting, "Good afternoon");
  assert.equal(getDashboardHeader(new Date("2026-08-31T20:00:00")).greeting, "Good evening");
});

test("demo login validation rejects malformed and non-demo credentials", () => {
  assert.equal(validateDemoLogin(DEMO_EMAIL, DEMO_PASSWORD).form, undefined);
  assert.ok(validateDemoLogin("bad", "123").email);
  assert.ok(validateDemoLogin("bad", "123").password);
  assert.ok(validateDemoLogin("someone@example.com", "long-enough").form);
  assert.equal(validateDemoLogin(DEMO_EMAIL, "changed-password", "changed-password").form, undefined);
});

test("customer filters and sort are typed and deterministic", () => {
  const rows = [
    { id: 1, name: "Beta", email: "b@example.com", city: "X", country: "Y", orders: 1, spend: 50, joined: "now", status: "Active", type: "Retail", initials: "B" },
    { id: 2, name: "Alpha", email: "a@example.com", city: "X", country: "Y", orders: 4, spend: 20, joined: "now", status: "At risk", type: "Wholesale", initials: "A" },
  ];
  assert.deepEqual(filterAndSortCustomers(rows, "alpha", "All", "All", "spend").map((item) => item.name), ["Alpha"]);
  assert.deepEqual(filterAndSortCustomers(rows, "", "All", "All", "name").map((item) => item.name), ["Alpha", "Beta"]);
  assert.deepEqual(filterAndSortCustomers(rows, "", "Active", "Retail", "spend").map((item) => item.name), ["Beta"]);
});

test("order filters and sort return the expected rows", () => {
  const rows = [
    { id: "LM-1002", customer: "Beta", date: "now", items: 1, payment: "Card", total: 50, paymentStatus: "Paid", fulfillment: "Processing" },
    { id: "LM-1001", customer: "Alpha", date: "now", items: 1, payment: "Card", total: 80, paymentStatus: "Paid", fulfillment: "Delivered" },
  ];
  assert.deepEqual(filterAndSortOrders(rows, "alpha", "All", "newest").map((item) => item.id), ["LM-1001"]);
  assert.deepEqual(filterAndSortOrders(rows, "", "All", "total").map((item) => item.id), ["LM-1001", "LM-1002"]);
  assert.deepEqual(filterAndSortOrders(rows, "", "Processing", "newest").map((item) => item.id), ["LM-1002"]);
});

test("CSV export escapes commas and quotes", () => {
  const csv = buildCsv(["Name", "Note"], [["Maya, Chen", 'Said "hello"']]);
  assert.equal(csv, 'Name,Note\n"Maya, Chen","Said ""hello"""');
});
