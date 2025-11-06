"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalButton } from "@/components/cal-embed";
import { IconCalendar, IconClock } from "@tabler/icons-react";

type CapacityStatus = "available" | "limited" | "full";

interface TimeSlot {
  id: string;
  time: string;
  date: string;
  capacity: CapacityStatus;
  spotsLeft?: number;
  calLink?: string;
}

interface AppointmentSlotsProps {
  slots?: TimeSlot[];
}

const defaultSlots: TimeSlot[] = [
  {
    id: "1",
    time: "09:00 AM",
    date: "Monday, Nov 11",
    capacity: "available",
    spotsLeft: 5,
    calLink: "your-username/30min",
  },
  {
    id: "2",
    time: "11:00 AM",
    date: "Monday, Nov 11",
    capacity: "available",
    spotsLeft: 4,
    calLink: "your-username/30min",
  },
  {
    id: "3",
    time: "02:00 PM",
    date: "Monday, Nov 11",
    capacity: "limited",
    spotsLeft: 2,
    calLink: "your-username/30min",
  },
  {
    id: "4",
    time: "04:00 PM",
    date: "Monday, Nov 11",
    capacity: "limited",
    spotsLeft: 1,
    calLink: "your-username/30min",
  },
  {
    id: "5",
    time: "09:00 AM",
    date: "Tuesday, Nov 12",
    capacity: "available",
    spotsLeft: 5,
    calLink: "your-username/30min",
  },
  {
    id: "6",
    time: "03:00 PM",
    date: "Tuesday, Nov 12",
    capacity: "full",
    spotsLeft: 0,
    calLink: "your-username/30min",
  },
];

function CapacityIndicator({
  status,
  spotsLeft,
}: {
  status: CapacityStatus;
  spotsLeft?: number;
}) {
  const statusConfig = {
    available: {
      color: "bg-green-500",
      text: "Available",
      textColor: "text-green-700 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/30",
      borderColor: "border-green-200 dark:border-green-800",
    },
    limited: {
      color: "bg-yellow-500",
      text: "Limited",
      textColor: "text-yellow-700 dark:text-yellow-400",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
      borderColor: "border-yellow-200 dark:border-yellow-800",
    },
    full: {
      color: "bg-red-500",
      text: "Full",
      textColor: "text-red-700 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-950/30",
      borderColor: "border-red-200 dark:border-red-800",
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      {/* Traffic light indicator */}
      <div className="flex items-center gap-1.5">
        <div
          className={`h-2.5 w-2.5 rounded-full ${config.color} animate-pulse`}
        />
        <span className={`text-xs font-medium ${config.textColor}`}>
          {config.text}
        </span>
      </div>
      {/* Spots left badge */}
      {status !== "full" && spotsLeft !== undefined && (
        <Badge
          variant="outline"
          className={`text-xs ${config.textColor} ${config.borderColor}`}
        >
          {spotsLeft} {spotsLeft === 1 ? "spot" : "spots"} left
        </Badge>
      )}
    </div>
  );
}

export function AppointmentSlots({
  slots = defaultSlots,
}: AppointmentSlotsProps) {
  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Available Appointment Slots
        </h2>
        <p className="text-muted-foreground mt-2">
          Book your appointment - real-time availability
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {slots.map((slot) => (
          <Card
            key={slot.id}
            className={`transition-all hover:shadow-lg ${
              slot.capacity === "full" ? "opacity-60" : ""
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <IconCalendar className="text-primary h-5 w-5" />
                  <CardTitle className="text-lg">{slot.date}</CardTitle>
                </div>
              </div>
              <CardDescription className="flex items-center gap-1.5 pt-1">
                <IconClock className="h-4 w-4" />
                <span className="font-medium">{slot.time}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <CapacityIndicator
                status={slot.capacity}
                spotsLeft={slot.spotsLeft}
              />

              {slot.capacity !== "full" ? (
                <CalButton
                  calLink={slot.calLink || "your-username/30min"}
                  config={{ theme: "auto" }}
                  className="w-full"
                >
                  <Button className="w-full" size="sm">
                    Book This Slot
                  </Button>
                </CalButton>
              ) : (
                <Button className="w-full" size="sm" variant="outline" disabled>
                  Fully Booked
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Legend */}
      <div className="bg-muted/50 mt-8 rounded-lg border p-4">
        <h3 className="mb-3 text-sm font-semibold">Availability Legend:</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-sm">Available (3+ spots)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <span className="text-sm">Limited (1-2 spots)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <span className="text-sm">Fully Booked</span>
          </div>
        </div>
      </div>
    </div>
  );
}
