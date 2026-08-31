"use client";

import { useMemo, useState, type FormEvent } from "react";
import { CalendarDays, Eye, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { orders as initialOrders } from "@/src/data/mock";
import { Button, DataState, EmptyState, PageHeader, Pagination, SearchInput, StatusBadge } from "@/src/components/ui";
import { filterAndSortOrders, type OrderSort, type OrderStatusFilter } from "@/src/lib/collections";
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

function CreateOrderDialog({ onCreate }: { onCreate: (order: Order) => void }) {
  const [open, setOpen] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const customer = String(form.get("customer") ?? "").trim();
    const items = Number(form.get("items"));
    const total = Number(form.get("total"));
    const payment = String(form.get("payment") ?? "Card") as Order["payment"];

    if (!customer || !Number.isInteger(items) || items < 1 || !Number.isFinite(total) || total <= 0) {
      toast.error("Enter a customer, item count, and valid total");
      return;
    }

    const order: Order = {
      id: `LM-${Math.floor(Date.now() / 1000).toString().slice(-4)}`,
      customer,
      date: new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date()),
      items,
      payment,
      total,
      paymentStatus: "Paid",
      fulfillment: "Processing",
    };
    onCreate(order);
    setOpen(false);
    event.currentTarget.reset();
    toast.success(`${order.id} created`);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button><Plus aria-hidden="true" size={16} /> Create order</Button></DialogTrigger>
      <DialogContent className="details-dialog">
        <DialogHeader><DialogTitle>Create order</DialogTitle><DialogDescription>Add a local demo order to the fulfillment table.</DialogDescription></DialogHeader>
        <form className="dialog-form" onSubmit={submit}>
          <label className="form-field"><span>Customer</span><input name="customer" required /></label>
          <div className="form-grid">
            <label className="form-field"><span>Items</span><input name="items" type="number" min="1" step="1" defaultValue="1" required /></label>
            <label className="form-field"><span>Total</span><input name="total" type="number" min="0.01" step="0.01" required /></label>
          </div>
          <label className="form-field"><span>Payment method</span><select name="payment" defaultValue="Card"><option value="Card">Card</option><option value="PayPal">PayPal</option><option value="Bank transfer">Bank transfer</option></select></label>
          <Button type="submit">Create order</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function OrdersPage() {
  const { demoState, setDemoState } = useDemoState();
  const [rows, setRows] = useState<Order[]>(initialOrders);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<OrderStatusFilter>("All");
  const [sort, setSort] = useState<OrderSort>("newest");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = useMemo(() => filterAndSortOrders(rows, query, status, sort), [rows, query, status, sort]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pages);
  const visible = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <>
      <PageHeader eyebrow="Fulfillment" title="Orders" description="Track each order from payment to the customer’s door." actions={<><span className="period-indicator"><CalendarDays aria-hidden="true" size={16} /> Current demo period</span><CreateOrderDialog onCreate={(order) => { setRows((current) => [order, ...current]); setPage(1); }} /></>} />
      <DataState state={demoState} onRetry={() => setDemoState("ready")} emptyTitle="No orders have been placed yet">
        <section className="panel data-panel">
          <div className="filter-bar">
            <SearchInput label="Search orders" placeholder="Search order or customer…" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} />
            <div className="filter-group">
              <label><span className="sr-only">Fulfillment status</span><select value={status} onChange={(event) => { setStatus(event.target.value as OrderStatusFilter); setPage(1); }}><option value="All">All</option><option value="Delivered">Delivered</option><option value="Processing">Processing</option><option value="In transit">In transit</option><option value="Cancelled">Cancelled</option></select></label>
              <label><span className="sr-only">Sort orders</span><select value={sort} onChange={(event) => setSort(event.target.value as OrderSort)}><option value="newest">Newest first</option><option value="total">Highest total</option></select></label>
            </div>
          </div>

          {visible.length === 0 ? <EmptyState title="No orders match those filters" description="Try a different order ID, customer, or fulfillment status." /> : (
            <>
              <div className="table-scroll order-table">
                <table>
                  <caption className="sr-only">Orders matching the current filters</caption>
                  <thead><tr><th scope="col">Order</th><th scope="col">Customer</th><th scope="col">Date</th><th scope="col">Items</th><th scope="col">Payment</th><th scope="col">Fulfillment</th><th scope="col" className="numeric">Total</th><th scope="col"><span className="sr-only">Actions</span></th></tr></thead>
                  <tbody>{visible.map((order) => (
                    <tr key={order.id}>
                      <td data-label="Order"><strong>{order.id}</strong></td>
                      <td data-label="Customer">{order.customer}</td>
                      <td data-label="Date">{order.date}</td>
                      <td data-label="Items">{order.items}</td>
                      <td data-label="Payment"><StatusBadge status={order.paymentStatus} /></td>
                      <td data-label="Fulfillment"><StatusBadge status={order.fulfillment} /></td>
                      <td data-label="Total" className="numeric"><strong>{"$" + order.total.toLocaleString()}</strong></td>
                      <td data-label="Actions"><Dialog><DialogTrigger asChild><button type="button" className="row-action" aria-label={"View " + order.id}><Eye aria-hidden="true" size={17} /></button></DialogTrigger><OrderDetails order={order} /></Dialog></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
              <div className="table-footer"><p aria-live="polite">Showing {visible.length} of {filtered.length} orders</p><Pagination page={safePage} pages={pages} onPage={setPage} /></div>
            </>
          )}
        </section>
      </DataState>
    </>
  );
}
