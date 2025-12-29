"use client";

import { motion } from "framer-motion";
import { Users, Star, Award, TrendingUp } from "lucide-react";
import { api } from "@/trpc/client";

interface StatItem {
  icon: React.ElementType;
  value: string;
  label: string;
}

function useStats(): StatItem[] {
  const { data: reviewStats } = api.reviews.getStats.useQuery();

  return [
    {
      icon: Users,
      value: "150+",
      label: "Teams",
    },
    {
      icon: Star,
      value: reviewStats?.averageRating?.toFixed(1) || "5.0",
      label: "Rating",
    },
    {
      icon: Award,
      value: "Top",
      label: "Rated",
    },
    {
      icon: TrendingUp,
      value: "95%",
      label: "Rebook",
    },
  ];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export function SocialProofStats() {
  const stats = useStats();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-card shadow-editorial grid grid-cols-2 gap-4 rounded-lg border p-6 sm:grid-cols-4"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className="flex flex-col items-center text-center"
        >
          <div className="bg-primary/10 mb-2 flex h-10 w-10 items-center justify-center rounded-full">
            <stat.icon className="text-primary h-5 w-5" />
          </div>
          <div className="text-foreground text-2xl font-bold tracking-tight">
            {stat.value}
          </div>
          <div className="text-muted-foreground text-sm">{stat.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}
