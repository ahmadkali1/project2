"use client";

import { Download, Lightbulb } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { categoryData, revenueData } from "@/src/data/mock";
import { Button, ChartCard, DataState, KpiCard, PageHeader } from "@/src/components/ui";
import { useDemoState } from "@/src/state/DemoContext";

const channelData = [
  { channel: "Direct", sessions: 7200, conversion: 5.6 },
  { channel: "Search", sessions: 5180, conversion: 4.9 },
  { channel: "Social", sessions: 3480, conversion: 3.7 },
  { channel: "Referral", sessions: 2380, conversion: 4.3 },
];

const products = [
  { name: "Linen Weekly Planner", category: "Paper", units: 184, revenue: 8648, growth: "+18%" },
  { name: "Oak Desk Tray", category: "Studio", units: 132, revenue: 7392, growth: "+12%" },
  { name: "Soft Carry Folio", category: "Accessories", units: 116, revenue: 6380, growth: "+9%" },
  { name: "Common Table Lamp", category: "Home", units: 74, revenue: 5920, growth: "+21%" },
];

export default function AnalyticsPage() {
  const { demoState, setDemoState } = useDemoState();
  return (
    <>
      <PageHeader eyebrow="Signals, not noise" title="Analytics" description="A readable view of growth, demand, and customer behavior." actions={<><label className="compact-select"><span className="sr-only">Date range</span><select defaultValue="6m"><option value="30d">Last 30 days</option><option value="6m">Last 6 months</option><option value="12m">Last 12 months</option></select></label><Button><Download size={16} /> Export</Button></>} />
      <DataState state={demoState} onRetry={() => setDemoState("ready")} emptyTitle="There is not enough data for a report yet">
        <section className="kpi-grid analytics-kpis" aria-label="Analytics summary">
          <KpiCard label="Average order value" value="$72.93" change="+4.2%" note="Across 642 orders" tone="sage" />
          <KpiCard label="Returning customers" value="38.6%" change="+3.1%" note="Healthy repeat demand" tone="blue" />
          <KpiCard label="Cart completion" value="61.4%" change="+5.8%" note="Up after checkout edits" tone="gold" />
          <KpiCard label="Refund rate" value="1.7%" change="-0.4%" note="Below 2.5% target" tone="coral" />
        </section>

        <div className="analytics-grid">
          <ChartCard title="Revenue & customer growth" caption="Momentum has held for three consecutive months." className="wide-chart">
            <div className="chart-wrap chart-wrap--large">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={1}>
                <LineChart data={revenueData} margin={{ top: 14, right: 12, bottom: 0, left: -16 }}>
                  <CartesianGrid strokeDasharray="4 8" vertical={false} stroke="var(--line)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-text)", fontSize: 12 }} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tickFormatter={(value) => "$" + value / 1000 + "k"} tick={{ fill: "var(--muted-text)", fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-text)", fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--line)", background: "var(--surface)" }} />
                  <Legend iconType="circle" />
                  <Line yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="#638775" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line yAxisId="right" type="monotone" dataKey="customers" name="New customers" stroke="#668FA3" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Sales by category" caption="A balanced mix, led by home goods.">
            <div className="donut-layout analytics-donut">
              <div className="donut-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categoryData} dataKey="value" innerRadius={52} outerRadius={80} paddingAngle={3} strokeWidth={0}>{categoryData.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}</Pie><Tooltip formatter={(value) => [value + "%", "Share"]} /></PieChart></ResponsiveContainer></div>
              <ul className="chart-legend">{categoryData.map((item) => <li key={item.name}><i style={{ background: item.fill }} /><span>{item.name}</span><strong>{item.value}%</strong></li>)}</ul>
            </div>
          </ChartCard>

          <ChartCard title="Orders per month" caption="Completed orders continue to rise.">
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={1}>
                <BarChart data={revenueData} margin={{ top: 10, right: 8, left: -28, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 8" vertical={false} stroke="var(--line)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-text)", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted-text)", fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--line)", background: "var(--surface)" }} />
                  <Bar dataKey="orders" name="Orders" fill="#D9B65D" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Channel quality" caption="Traffic is useful only when it converts.">
            <div className="channel-list">{channelData.map((channel) => <div key={channel.channel}><div><strong>{channel.channel}</strong><span>{channel.sessions.toLocaleString()} sessions</span></div><div className="channel-meter"><i style={{ width: channel.conversion * 13 + "%" }} /></div><strong>{channel.conversion}%</strong></div>)}</div>
          </ChartCard>
        </div>

        <div className="dashboard-lower analytics-lower">
          <section className="panel table-panel">
            <header className="panel-heading"><div><h2>Top-performing products</h2><p>Products ranked by August revenue.</p></div></header>
            <div className="table-scroll"><table><thead><tr><th>Product</th><th>Category</th><th>Units</th><th>Growth</th><th className="numeric">Revenue</th></tr></thead><tbody>{products.map((product) => <tr key={product.name}><td><strong>{product.name}</strong></td><td>{product.category}</td><td>{product.units}</td><td><span className="positive">{product.growth}</span></td><td className="numeric"><strong>{"$" + product.revenue.toLocaleString()}</strong></td></tr>)}</tbody></table></div>
          </section>
          <aside className="insight-card">
            <span><Lightbulb aria-hidden="true" /></span>
            <p className="eyebrow">Worth noticing</p>
            <h2>Home goods are growing without discount pressure.</h2>
            <p>Revenue rose 21% while average discounting stayed under 4%. Consider featuring the table lamp in September’s direct campaign.</p>
          </aside>
        </div>
      </DataState>
    </>
  );
}
