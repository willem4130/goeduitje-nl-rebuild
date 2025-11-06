"use client";

import { CalButton } from "@/components/cal-embed";
import { Button } from "@/components/ui/button";
import { IconCalendar } from "@tabler/icons-react";

interface BookingButtonProps {
  calLink?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function BookingButton({
  calLink = "your-username/30min",
  variant = "default",
  size = "default",
  className = "",
}: BookingButtonProps) {
  return (
    <CalButton
      calLink={calLink}
      config={{
        theme: "auto",
      }}
      className={className}
    >
      <Button variant={variant} size={size}>
        <IconCalendar className="mr-2 size-4" />
        Schedule a Meeting
      </Button>
    </CalButton>
  );
}
