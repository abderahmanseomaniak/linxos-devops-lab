"use client";

import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

export default function ToastTestPage() {
  return (
    <div className="p-10 space-y-4">
      <h1 className="text-xl font-bold">Toast Test</h1>

      <Button variant="default" onClick={() => toast.success("Success ✔")}>
        Success
      </Button>

      <Button variant="destructive" onClick={() => toast.error("Error ❌")}>
        Error
      </Button>

      <Button variant="secondary" onClick={() => toast.info("Info 🔵")}>
        Info
      </Button>

      <Button variant="default" onClick={() => toast.warning("Warning ⚠️")}>
        Warning
      </Button>
    </div>
  );
}