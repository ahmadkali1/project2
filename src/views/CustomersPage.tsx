"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Eye, Plus, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { customers as initialCustomers } from "@/src/data/mock";
import { Button, DataState, EmptyState, PageHeader, Pagination, SearchInput, StatusBadge } from "@/src/components/ui";
import { filterAndSortCustomers, type CustomerSort, type CustomerStatusFilter, type CustomerTypeFilter } from "@/src/lib/collections";
import { useDemoState } from "@/src/state/DemoContext";
import type { Customer } from "@/src/types";

function CustomerDetails({ customer }: { customer: Customer }) {
  return (
    <DialogContent className="details-dialog">
      <DialogHeader>
        <div className="detail-person"><span className="avatar avatar--large">{customer.initials}</span><div><DialogTitle>{customer.name}</DialogTitle><DialogDescription>{customer.email}</DialogDescription></div></div>
      </DialogHeader>
      <div className="detail-grid">
        <div><span>Location</span><strong>{customer.city}, {customer.country}</strong></div>
        <div><span>Customer type</span><strong>{customer.type}</strong></div>
        <div><span>Total orders</span><strong>{customer.orders}</strong></div>
        <div><span>Lifetime spend</span><strong>{"$" + customer.spend.toLocaleString()}</strong></div>
        <div><span>Joined</span><strong>{customer.joined}</strong></div>
        <div><span>Status</span><StatusBadge status={customer.status} /></div>
      </div>
    </DialogContent>
  );
}

function AddCustomerDialog({ onAdd }: { onAdd: (customer: Customer) => void }) {
  const [open, setOpen] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const city = String(form.get("city") ?? "").trim();
    const country = String(form.get("country") ?? "").trim();
    const type = String(form.get("type") ?? "Retail") as Customer["type"];

    if (!name || !/^\S+@\S+\.\S+$/.test(email) || !city || !country) {
      toast.error("Complete the customer form with a valid email");
      return;
    }

    const initials = name.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "CU";
    onAdd({
      id: Date.now(),
      name,
      email,
      city,
      country,
      type,
      status: "Active",
      orders: 0,
      spend: 0,
      initials,
      joined: new Intl.DateTimeFormat("en", { month: "short", day: "2-digit", year: "numeric" }).format(new Date()),
    });
    setOpen(false);
    event.currentTarget.reset();
    toast.success(`${name} added`);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button><Plus aria-hidden="true" size={16} /> Add customer</Button></DialogTrigger>
      <DialogContent className="details-dialog">
        <DialogHeader><DialogTitle>Add customer</DialogTitle><DialogDescription>Create a customer in the local portfolio demo.</DialogDescription></DialogHeader>
        <form className="dialog-form" onSubmit={submit}>
          <label className="form-field"><span>Name</span><input name="name" autoComplete="name" required /></label>
          <label className="form-field"><span>Email</span><input name="email" type="email" autoComplete="email" required /></label>
          <div className="form-grid">
            <label className="form-field"><span>City</span><input name="city" required /></label>
            <label className="form-field"><span>Country</span><input name="country" required /></label>
          </div>
          <label className="form-field"><span>Customer type</span><select name="type" defaultValue="Retail"><option value="Retail">Retail</option><option value="Wholesale">Wholesale</option></select></label>
          <Button type="submit">Add customer</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function CustomersPage() {
  const { demoState, setDemoState } = useDemoState();
  const [rows, setRows] = useState<Customer[]>(initialCustomers);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<CustomerStatusFilter>("All");
  const [type, setType] = useState<CustomerTypeFilter>("All");
  const [sort, setSort] = useState<CustomerSort>("spend");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = useMemo(() => filterAndSortCustomers(rows, query, status, type, sort), [rows, query, status, type, sort]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pages);
  const visible = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  function resetPage() { setPage(1); }

  return (
    <>
      <PageHeader eyebrow="Relationships" title="Customers" description="Know who is buying, who is growing, and who might need attention." actions={<AddCustomerDialog onAdd={(customer) => { setRows((current) => [customer, ...current]); setPage(1); }} />} />
      <DataState state={demoState} onRetry={() => setDemoState("ready")} emptyTitle="No customers have joined yet">
        <section className="panel data-panel">
          <div className="filter-bar">
            <SearchInput label="Search customers" placeholder="Search name or email…" value={query} onChange={(event) => { setQuery(event.target.value); resetPage(); }} />
            <div className="filter-group">
              <SlidersHorizontal size={17} aria-hidden="true" />
              <label><span className="sr-only">Status</span><select value={status} onChange={(event) => { setStatus(event.target.value as CustomerStatusFilter); resetPage(); }}><option value="All">All</option><option value="Active">Active</option><option value="At risk">At risk</option><option value="Inactive">Inactive</option></select></label>
              <label><span className="sr-only">Customer type</span><select value={type} onChange={(event) => { setType(event.target.value as CustomerTypeFilter); resetPage(); }}><option value="All">All</option><option value="Retail">Retail</option><option value="Wholesale">Wholesale</option></select></label>
              <label><span className="sr-only">Sort customers</span><select value={sort} onChange={(event) => setSort(event.target.value as CustomerSort)}><option value="spend">Highest spend</option><option value="orders">Most orders</option><option value="name">Name A–Z</option></select></label>
            </div>
          </div>

          {visible.length === 0 ? <EmptyState title="No customers match those filters" description="Clear a filter or try a different name or email." /> : (
            <>
              <div className="table-scroll customer-table">
                <table>
                  <caption className="sr-only">Customers matching the current filters</caption>
                  <thead><tr><th scope="col">Customer</th><th scope="col">Location</th><th scope="col">Status</th><th scope="col">Orders</th><th scope="col">Lifetime spend</th><th scope="col"><span className="sr-only">Actions</span></th></tr></thead>
                  <tbody>{visible.map((customer) => (
                    <tr key={customer.id}>
                      <td data-label="Customer"><div className="person-cell"><span className="avatar" aria-hidden="true">{customer.initials}</span><div><strong>{customer.name}</strong><small>{customer.email}</small></div></div></td>
                      <td data-label="Location"><strong>{customer.city}</strong><small>{customer.country}</small></td>
                      <td data-label="Status"><StatusBadge status={customer.status} /></td>
                      <td data-label="Orders">{customer.orders}</td>
                      <td data-label="Lifetime spend"><strong>{"$" + customer.spend.toLocaleString()}</strong></td>
                      <td data-label="Actions"><Dialog><DialogTrigger asChild><button type="button" className="row-action" aria-label={"View " + customer.name}><Eye aria-hidden="true" size={17} /></button></DialogTrigger><CustomerDetails customer={customer} /></Dialog></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
              <div className="table-footer"><p aria-live="polite">Showing {visible.length} of {filtered.length} customers</p><Pagination page={safePage} pages={pages} onPage={setPage} /></div>
            </>
          )}
        </section>
      </DataState>
    </>
  );
}
