import type { Customer, Order } from "@/src/types";

export const customers: Customer[] = [
  { id: 1, name: "Maya Chen", email: "maya@common.studio", city: "Portland", country: "USA", orders: 18, spend: 8420, joined: "Aug 18, 2025", status: "Active", type: "Wholesale", initials: "MC" },
  { id: 2, name: "Noah Williams", email: "noah@fieldnote.co", city: "London", country: "UK", orders: 12, spend: 5160, joined: "Sep 02, 2025", status: "Active", type: "Retail", initials: "NW" },
  { id: 3, name: "Sofia Marin", email: "sofia@northstar.es", city: "Madrid", country: "Spain", orders: 7, spend: 2890, joined: "Oct 11, 2025", status: "At risk", type: "Retail", initials: "SM" },
  { id: 4, name: "Elias Haddad", email: "elias@cedarworks.ae", city: "Dubai", country: "UAE", orders: 24, spend: 12680, joined: "Nov 05, 2025", status: "Active", type: "Wholesale", initials: "EH" },
  { id: 5, name: "Amelia Brooks", email: "amelia@goodform.ca", city: "Toronto", country: "Canada", orders: 4, spend: 1340, joined: "Dec 19, 2025", status: "Inactive", type: "Retail", initials: "AB" },
  { id: 6, name: "Luca Bianchi", email: "luca@atelier24.it", city: "Milan", country: "Italy", orders: 11, spend: 4780, joined: "Jan 08, 2026", status: "Active", type: "Wholesale", initials: "LB" },
  { id: 7, name: "Aisha Rahman", email: "aisha@kindred.sg", city: "Singapore", country: "Singapore", orders: 9, spend: 3240, joined: "Feb 14, 2026", status: "Active", type: "Retail", initials: "AR" },
  { id: 8, name: "Ben Carter", email: "ben@wander.nz", city: "Auckland", country: "New Zealand", orders: 5, spend: 1980, joined: "Mar 03, 2026", status: "At risk", type: "Retail", initials: "BC" },
  { id: 9, name: "Hana Kim", email: "hana@paperplane.kr", city: "Seoul", country: "South Korea", orders: 16, spend: 7390, joined: "Apr 21, 2026", status: "Active", type: "Wholesale", initials: "HK" },
  { id: 10, name: "Omar Khalil", email: "omar@olivehouse.jo", city: "Amman", country: "Jordan", orders: 6, spend: 2150, joined: "May 16, 2026", status: "Active", type: "Retail", initials: "OK" },
];

export const orders: Order[] = [
  { id: "LM-1048", customer: "Maya Chen", date: "Aug 30, 2026", items: 6, payment: "Card", total: 1240, paymentStatus: "Paid", fulfillment: "Delivered" },
  { id: "LM-1047", customer: "Elias Haddad", date: "Aug 30, 2026", items: 3, payment: "Bank transfer", total: 860, paymentStatus: "Paid", fulfillment: "In transit" },
  { id: "LM-1046", customer: "Hana Kim", date: "Aug 29, 2026", items: 8, payment: "Card", total: 1930, paymentStatus: "Paid", fulfillment: "Processing" },
  { id: "LM-1045", customer: "Noah Williams", date: "Aug 29, 2026", items: 2, payment: "PayPal", total: 420, paymentStatus: "Pending", fulfillment: "Processing" },
  { id: "LM-1044", customer: "Luca Bianchi", date: "Aug 28, 2026", items: 5, payment: "Card", total: 1120, paymentStatus: "Paid", fulfillment: "Delivered" },
  { id: "LM-1043", customer: "Sofia Marin", date: "Aug 28, 2026", items: 1, payment: "PayPal", total: 180, paymentStatus: "Refunded", fulfillment: "Cancelled" },
  { id: "LM-1042", customer: "Aisha Rahman", date: "Aug 27, 2026", items: 4, payment: "Card", total: 745, paymentStatus: "Paid", fulfillment: "In transit" },
  { id: "LM-1041", customer: "Omar Khalil", date: "Aug 27, 2026", items: 2, payment: "Bank transfer", total: 510, paymentStatus: "Pending", fulfillment: "Processing" },
  { id: "LM-1040", customer: "Ben Carter", date: "Aug 26, 2026", items: 7, payment: "Card", total: 1480, paymentStatus: "Paid", fulfillment: "Delivered" },
  { id: "LM-1039", customer: "Amelia Brooks", date: "Aug 25, 2026", items: 3, payment: "PayPal", total: 620, paymentStatus: "Paid", fulfillment: "Delivered" },
];

export const revenueData = [
  { month: "Mar", revenue: 28400, orders: 410, customers: 82 },
  { month: "Apr", revenue: 32100, orders: 462, customers: 94 },
  { month: "May", revenue: 30600, orders: 438, customers: 91 },
  { month: "Jun", revenue: 36800, orders: 518, customers: 108 },
  { month: "Jul", revenue: 41200, orders: 576, customers: 123 },
  { month: "Aug", revenue: 46820, orders: 642, customers: 137 },
];

export const categoryData = [
  { name: "Home", value: 34, fill: "#789D8B" },
  { name: "Studio", value: 27, fill: "#668FA3" },
  { name: "Paper", value: 22, fill: "#D9B65D" },
  { name: "Accessories", value: 17, fill: "#D9826B" },
];

export const activities = [
  { title: "Order LM-1048 was delivered", time: "12 min ago", tone: "sage" },
  { title: "Maya Chen joined Wholesale", time: "42 min ago", tone: "blue" },
  { title: "August report is ready", time: "2 hours ago", tone: "gold" },
  { title: "Stock alert: Linen planner", time: "4 hours ago", tone: "coral" },
];
