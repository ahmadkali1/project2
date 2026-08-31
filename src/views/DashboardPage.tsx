"use client";

import { ArrowUpRight, CalendarDays, Download } from "lucide-react";
import { Link } from "react-router";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { activities, categoryData, orders, revenueData } from "@/src/data/mock";
import { Button, ChartCard, DataState, KpiCard, PageHeader, StatusBadge } from "@/src/components/ui";
import { useDemoState } from "@/src/state/DemoContext";

export default function DashboardPage() {
  const { demoState, setDemoState } = useDemoState();
  return (
    <>
      <PageHeader
        eyebrow="Sunday · August 31"
        title="Good morning, Ahmad."
        description="Here’s what changed across your business since yesterday."
        actions={<><Button variant="secondary"><CalendarDays size={16} /> Last 30 days</Button><Button><Download size={16} /> Export report</Button></>}
      />
      <DataState state={demoState} onRetry={() => setDemoState("ready")} emptyTitle="Your dashboard is ready for its first sale">
        <section className="kpi-grid" aria-label="Key performance indicators">
          <KpiCard label="Total revenue" value="$46,820" change="+12.4%" note="vs. $41,650 last month" tone="sage" />
          <KpiCard label="New customers" value="137" change="+8.2%" note="31 joined this week" tone="blue" />
          <KpiCard label="Completed orders" value="642" change="+15.1%" note="92.6% fulfillment rate" tone="gold" />
          <KpiCard label="Conversion rate" value="4.8%" change="+0.6%" note="from 18,240 sessions" tone="coral" />
        </section>

        <div className="dashboard-grid">
          <ChartCard title="Revenue rhythm" caption="Six-month revenue, with the noise turned down." action={<button className="text-action">View report <ArrowUpRight size={15} /></button>} className="revenue-card">
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={1}>
                <AreaChart data={revenueData} margin={{ top: 16, right: 6, bottom: 0, left: -20 }}>
                  <defs><linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#789D8B" stopOpacity={0.36} /><stop offset="100%" stopColor="#789D8B" stopOpacity={0.02} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="4 8" vertical={false} stroke="var(--line)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-text)", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => "$" + value / 1000 + "k"} tick={{ fill: "var(--muted-text)", fontSize: 12 }} />
                  <Tooltip formatter={(value) => ["$" + Number(value).toLocaleString(), "Revenue"]} contentStyle={{ borderRadius: 10, border: "1px solid var(--line)", background: "var(--surface)" }} />
                  <Area type="monotone" dataKey="revenue" stroke="#638775" strokeWidth={2.5} fill="url(#revenueFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Sales mix" caption="Revenue by product family." className="mix-card">
            <div className="donut-layout">
              <div className="donut-wrap">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={1}>
                  <PieChart><Pie data={categoryData} dataKey="value" innerRadius={56} outerRadius={78} paddingAngle={3} strokeWidth={0}>{categoryData.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}</Pie><Tooltip formatter={(value) => [value + "%", "Share"]} /></PieChart>
                </ResponsiveContainer>
                <span><strong>100%</strong><small>sales mix</small></span>
              </div>
              <ul className="chart-legend">{categoryData.map((item) => <li key={item.name}><i style={{ background: item.fill }} /><span>{item.name}</span><strong>{item.value}%</strong></li>)}</ul>
            </div>
          </ChartCard>
        </div>

        <div className="dashboard-lower">
          <section className="panel table-panel">
            <header className="panel-heading"><div><h2>Recent orders</h2><p>The latest movement through your store.</p></div><Link to="/orders">View all</Link></header>
            <div className="table-scroll">
              <table><thead><tr><th>Order</th><th>Customer</th><th>Status</th><th className="numeric">Total</th></tr></thead>
                <tbody>{orders.slice(0, 5).map((order) => <tr key={order.id}><td><strong>{order.id}</strong><small>{order.date}</small></td><td>{order.customer}</td><td><StatusBadge status={order.fulfillment} /></td><td className="numeric">{"$" + order.total.toLocaleString()}</td></tr>)}</tbody>
              </table>
            </div>
          </section>
          <section className="panel activity-panel">
            <header className="panel-heading"><div><h2>Activity</h2><p>A quiet log of important changes.</p></div></header>
            <ol className="activity-list">{activities.map((activity) => <li key={activity.title}><i className={"activity-dot activity-dot--" + activity.tone} /><div><strong>{activity.title}</strong><small>{activity.time}</small></div></li>)}</ol>
          </section>
        </div>
      </DataState>
    </>
  );
}
