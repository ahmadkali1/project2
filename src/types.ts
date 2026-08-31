export type DemoState = "ready" | "loading" | "error" | "empty";

export type Customer = {
  id: number;
  name: string;
  email: string;
  city: string;
  country: string;
  orders: number;
  spend: number;
  joined: string;
  status: "Active" | "At risk" | "Inactive";
  type: "Retail" | "Wholesale";
  initials: string;
};

export type Order = {
  id: string;
  customer: string;
  date: string;
  items: number;
  payment: "Card" | "PayPal" | "Bank transfer";
  total: number;
  paymentStatus: "Paid" | "Pending" | "Refunded";
  fulfillment: "Delivered" | "Processing" | "In transit" | "Cancelled";
};
