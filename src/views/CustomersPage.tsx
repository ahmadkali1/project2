"use client";

import { useMemo, useState } from "react";
import { Eye, Plus, SlidersHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { customers } from "@/src/data/mock";
import { Button, DataState, EmptyState, PageHeader, Pagination, SearchInput, StatusBadge } from "@/src/components/ui";
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

export default function CustomersPage() {
  const { demoState, setDemoState } = useDemoState();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [type, setType] = useState("All");
  const [sort, setSort] = useState("spend");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase();
    return customers
      .filter((customer) => !normalized || customer.name.toLowerCase().includes(normalized) || customer.email.toLowerCase().includes(normalized))
      .filter((customer) => status === "All" || customer.status === status)
      .filter((customer) => type === "All" || customer.type === type)
      .sort((a, b) => sort === "name" ? a.name.localeCompare(b.name) : sort === "orders" ? b.orders - a.orders : b.spend - a.spend);
  }, [query, status, type, sort]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  function resetPage() { setPage(1); }

  return (
    <>
      <PageHeader eyebrow="Relationships" title="Customers" description="Know who is buying, who is growing, and who might need attention." actions={<Button><Plus size={16} /> Add customer</Button>} />
      <DataState state={demoState} onRetry={() => setDemoState("ready")} emptyTitle="No customers have joined yet">
        <section className="panel data-panel">
          <div className="filter-bar">
            <SearchInput label="Search customers" placeholder="Search name or email…" value={query} onChange={(event) => { setQuery(event.target.value); resetPage(); }} />
            <div className="filter-group">
              <SlidersHorizontal size={17} aria-hidden="true" />
              <label><span className="sr-only">Status</span><select value={status} onChange={(event) => { setStatus(event.target.value); resetPage(); }}><option>All</option><option>Active</option><option>At risk</option><option>Inactive</option></select></label>
              <label><span className="sr-only">Customer type</span><select value={type} onChange={(event) => { setType(event.target.value); resetPage(); }}><option>All</option><option>Retail</option><option>Wholesale</option></select></label>
              <label><span className="sr-only">Sort customers</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="spend">Highest spend</option><option value="orders">Most orders</option><option value="name">Name A–Z</option></select></label>
            </div>
          </div>

          {visible.length === 0 ? <EmptyState title="No customers match those filters" description="Clear a filter or try a different name or email." /> : (
            <>
              <div className="table-scroll customer-table">
                <table>
                  <thead><tr><th>Customer</th><th>Location</th><th>Status</th><th>Orders</th><th>Lifetime spend</th><th><span className="sr-only">Actions</span></th></tr></thead>
                  <tbody>{visible.map((customer) => (
                    <tr key={customer.id}>
                      <td data-label="Customer"><div className="person-cell"><span className="avatar">{customer.initials}</span><div><strong>{customer.name}</strong><small>{customer.email}</small></div></div></td>
                      <td data-label="Location"><strong>{customer.city}</strong><small>{customer.country}</small></td>
                      <td data-label="Status"><StatusBadge status={customer.status} /></td>
                      <td data-label="Orders">{customer.orders}</td>
                      <td data-label="Lifetime spend"><strong>{"$" + customer.spend.toLocaleString()}</strong></td>
                      <td data-label="Actions"><Dialog><DialogTrigger asChild><button className="row-action" aria-label={"View " + customer.name}><Eye size={17} /></button></DialogTrigger><CustomerDetails customer={customer} /></Dialog></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
              <div className="table-footer"><p>Showing {visible.length} of {filtered.length} customers</p><Pagination page={page} pages={pages} onPage={setPage} /></div>
            </>
          )}
        </section>
      </DataState>
    </>
  );
}
