"use client";

import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/src/components/ui";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <section className="not-found">
      <span>404</span>
      <p className="eyebrow">This path wandered off</p>
      <h1>There’s nothing to manage here.</h1>
      <p>The page may have moved, or the link was copied incorrectly.</p>
      <Button onClick={() => navigate("/dashboard")}><ArrowLeft size={16} /> Back to dashboard</Button>
    </section>
  );
}
