"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Crown } from "lucide-react";

export default function PlanBadge() {
  return (
    <Badge
      variant="outline"
      className={cn(
        "ml-2 bg-gradient-to-r from-green-100 to-green-200 border-green-300 hidden lg:flex flex-row items-center"
      )}
    >
      <Crown className="w-3 h-3 mr-1 text-green-600" />
      Free Plan
    </Badge>
  );
}
