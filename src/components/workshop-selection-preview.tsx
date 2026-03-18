"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Users, MapPin, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * Live preview of workshop selections as users configure their outing
 * Updates in real-time with smooth animations
 */

export interface WorkshopPreviewData {
  id: string;
  name: string;
}

interface WorkshopSelectionPreviewProps {
  selectedWorkshops: WorkshopPreviewData[];
  participantCount?: number;
  location?: string;
}

// Map workshop IDs to image paths
const WORKSHOP_IMAGES: Record<string, string> = {
  beachvolleybal: "/images/workshops/beachvolleybal.jpg",
  "design-tshirt": "/images/workshops/design-tshirt.jpg",
  "koffie-thee": "/images/workshops/koffie-thee.jpg",
  "the-game": "/images/workshops/the-game.jpg",
  "bouw-of-bak-battle": "/images/workshops/bouw-of-bak-battle.jpeg",
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut" as const,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.2,
    },
  },
};

export function WorkshopSelectionPreview({
  selectedWorkshops,
  participantCount,
  location,
}: WorkshopSelectionPreviewProps) {
  const hasSelections =
    selectedWorkshops.length > 0 || participantCount || location;

  return (
    <Card className="shadow-editorial">
      <CardHeader>
        <CardTitle className="text-lg">Jouw selectie</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Info */}
        {(participantCount || location) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            {participantCount && (
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Users className="text-primary h-4 w-4" />
                <span>
                  {participantCount}{" "}
                  {participantCount === 1 ? "persoon" : "personen"}
                </span>
              </div>
            )}
            {location && (
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <MapPin className="text-primary h-4 w-4" />
                <span>{location}</span>
              </div>
            )}
          </motion.div>
        )}

        {/* Selected Uitjes */}
        {selectedWorkshops.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-foreground text-sm font-semibold">Uitjes</h3>
              <Badge variant="secondary">{selectedWorkshops.length}</Badge>
            </div>
            <AnimatePresence mode="popLayout">
              {selectedWorkshops.map((workshop) => (
                <motion.div
                  key={workshop.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  className="bg-card overflow-hidden rounded-lg border"
                >
                  <div className="flex items-center gap-3 p-3">
                    {/* Workshop Image or Icon */}
                    {WORKSHOP_IMAGES[workshop.id] ? (
                      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded">
                        <Image
                          src={WORKSHOP_IMAGES[workshop.id]!}
                          alt={workshop.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    ) : (
                      <div className="bg-primary/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded">
                        <CalendarDays className="text-primary h-5 w-5" />
                      </div>
                    )}

                    {/* Workshop Name */}
                    <div className="flex-1">
                      <p className="text-foreground text-sm font-medium">
                        {workshop.name}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-8 text-center"
          >
            <CalendarDays className="text-muted-foreground/30 mx-auto mb-3 h-12 w-12" />
            <p className="text-muted-foreground text-sm">
              Selecteer uitjes om te beginnen
            </p>
          </motion.div>
        )}

        {/* Empty State - No selections at all */}
        {!hasSelections && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-muted-foreground/30 rounded-lg border border-dashed p-6 text-center"
          >
            <p className="text-muted-foreground text-xs">
              Je selectie verschijnt hier terwijl je het formulier invult
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
