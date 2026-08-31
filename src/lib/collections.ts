import type { Customer, Order } from "@/src/types";

export type CustomerStatusFilter = "All" | Customer["status"];
export type CustomerTypeFilter = "All" | Customer["type"];
export type CustomerSort = "spend" | "orders" | "name";
export type OrderStatusFilter = "All" | Order["fulfillment"];
export type OrderSort = "newest" | "total";

export function filterAndSortCustomers(
  rows: Customer[],
  query: string,
  status: CustomerStatusFilter,
  type: CustomerTypeFilter,
  sort: CustomerSort,
) {
  const normalized = query.trim().toLowerCase();
  return [...rows]
    .filter((customer) => !normalized || customer.name.toLowerCase().includes(normalized) || customer.email.toLowerCase().includes(normalized))
    .filter((customer) => status === "All" || customer.status === status)
    .filter((customer) => type === "All" || customer.type === type)
    .sort((a, b) => sort === "name" ? a.name.localeCompare(b.name) : sort === "orders" ? b.orders - a.orders : b.spend - a.spend);
}

export function filterAndSortOrders(
  rows: Order[],
  query: string,
  status: OrderStatusFilter,
  sort: OrderSort,
) {
  const normalized = query.trim().toLowerCase();
  return [...rows]
    .filter((order) => !normalized || order.id.toLowerCase().includes(normalized) || order.customer.toLowerCase().includes(normalized))
    .filter((order) => status === "All" || order.fulfillment === status)
    .sort((a, b) => sort === "total" ? b.total - a.total : b.id.localeCompare(a.id));
}
