"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Eye, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { orders } from "@/src/data/mock";
import { Button, DataState, EmptyState, PageHeader, Pagination, SearchInput, StatusBadge } from "@/src/components/ui";
import { useDemoState } from "@/src/state/DemoContext";
import type { Order } from "@/src/types";

function OrderDetails({ order }: { order: Order }) {
  return (
    <DialogContent className="details-dialog">
      <DialogHeader><DialogTitle>Order {order.id}</DialogTitle><DialogDescription>Placed by {order.customer} on {order.date}</DialogDescription></DialogHeader>
      <div className="detail-grid">
        <div><span>Customer</span><strong>{order.customer}</strong></div>
        <div><span>Items</span><strong>{order.items}</strong></div>
        <div><span>Payment method</span><strong>{order.payment}</strong></div>
        <div><span>Total</span><strong>{"$" + order.total.toLocaleString()}</strong></div>
        <div><span>Payment</span><StatusBadge status={order.paymentStatus} /></div>
        <div><span>Fulfillment</span><StatusBadge status={order.fulfillment} /></div>
      </div>
    </DialogContent>
  );
}

export default function OrdersPage() {
  const { demoState, setDemoState } = useDemoState();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase();
    return orders
      .filter((order) => !normalized || order.id.toLowerCase().includes(normalized) || order.customer.toLowerCase().includes(normalized))
      .filter((order) => status === "All" || order.fulfillment === status)
      .sort((a, b) => sort === "total" ? b.total - a.total : b.id.localeCompare(a.id));
  }, [query, status, sort]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <PageHeader eyebrow="Fulfillment" title="Orders" description="Track each order from payment to the customer’s door." actions={<><Button variant="secondary"><CalendarDays size={16} /> Aug 1–31</Button><Button><Plus size={16} /> Create order</Button></>} />
      <DataState state={demoState} onRetry={() => setDemoState("ready")} emptyTitle="No orders have been placed yet">
        <section className="panel data-panel">
          <div className="filter-bar">
            <SearchInput label="Search orders" placeholder="Search order or customer…" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} />
            <div className="filter-group">
              <label><span className="sr-only">Fulfillment status</span><select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}><option>All</option><option>Delivered</option><option>Processing</option><option>In transit</option><option>Cancelled</option></select></label>
              <label><span className="sr-only">Sort orders</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="newest">Newest first</option><option value="total">Highest total</option></select></label>
            </div>
          </div>

          {visible.length === 0 ? <EmptyState title="No orders match those filters" description="Try a different order ID, customer, or fulfillment status." /> : (
            <>
              <div className="table-scroll order-table">
                <table>
                  <thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Items</th><th>Payment</th><th>Fulfillment</th><th className="numeric">Total</th><th><span className="sr-only">Actions</span></th></tr></thead>
                  <tbody>{visible.map((order) => (
                    <tr key={order.id}>
                      <td data-label="Order"><strong>{order.id}</strong></td>
                      <td data-label="Customer">{order.customer}</td>
                      <td data-label="Date">{order.date}</td>
                      <td data-label="Items">{order.items}</td>
                      <td data-label="Payment"><StatusBadge status={order.paymentStatus} /></td>
                      <td data-label="Fulfillment"><StatusBadge status={order.fulfillment} /></td>
                      <td data-label="Total" className="numeric"><strong>{"$" + order.total.toLocaleString()}</strong></td>
                      <td data-label="Actions"><Dialog><DialogTrigger asChild><button className="row-action" aria-label={"View " + order.id}><Eye size={17} /></button></DialogTrigger><OrderDetails order={order} /></Dialog></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
              <div className="table-footer"><p>Showing {visible.length} of {filtered.length} orders</p><Pagination page={page} pages={pages} onPage={setPage} /></div>
            </>
          )}
        </section>
      </DataState>
    </>
  );
}
