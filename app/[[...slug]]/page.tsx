import DashboardClient from "@/src/DashboardClient";

export function generateStaticParams() {
  return [
    { slug: [] },
    { slug: ["login"] },
    { slug: ["dashboard"] },
    { slug: ["customers"] },
    { slug: ["orders"] },
    { slug: ["analytics"] },
    { slug: ["settings"] },
  ];
}

export default function CatchAllPage() {
  return <DashboardClient />;
}
