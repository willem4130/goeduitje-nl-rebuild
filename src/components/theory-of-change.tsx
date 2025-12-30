"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";

interface TocItem {
  text: string;
}

interface TocData {
  activiteiten: TocItem[];
  outputs: TocItem[];
  directeEffecten: TocItem[];
  indirecteEffecten: TocItem[];
}

// Theory of Change data - Medewerker (from original goeduitje.nl)
export const tocMedewerkerData: TocData = {
  activiteiten: [
    { text: "Ontwikkelen van workshops" },
    { text: "Voorbereiden van workshops" },
    { text: "Bereiden van gerechten" },
    { text: "Uitvoeren taken tijdens workshops" },
    { text: "Leiden van workshops" },
    { text: "Evalueren van workshops" },
    { text: "Social media planning & content" },
    { text: "Administratie & coordinatie" },
  ],
  outputs: [
    { text: "Workshop opzet, formats & kostencalculatie" },
    { text: "Boodschappenlijst, plan van aanpak, planning" },
    { text: "Structuur & ritme" },
    { text: "Sociale interactie" },
    { text: "Feedback deelnemers & klantrecensies" },
    { text: "Evaluatieverslag" },
    { text: "Content calender & content" },
    { text: "Inventarisatie & planning" },
  ],
  directeEffecten: [
    { text: "Ontwikkelen algemene vaardigheden" },
    { text: "Ontwikkelen werkspecifieke vaardigheden" },
    { text: "Eigen maken Nederlandse taal" },
    { text: "Opbouwen netwerk" },
    { text: "Eigen maken Nederlandse werkcultuur" },
    { text: "Persoonlijke ontwikkeling" },
    { text: "Verbeteren positie op de arbeidsmarkt" },
    { text: "Vergroten zelfvertrouwen" },
    { text: "Positieve ervaring met Nederlandse werkcultuur" },
    { text: "Verbeteren financiele situatie" },
  ],
  indirecteEffecten: [
    {
      text: "Medewerkers vinden positie op de Nederlandse arbeidsmarkt die aansluit bij hun kennis, ervaring en interesses",
    },
  ],
};

// Theory of Change data - Klant/Deelnemer (from original goeduitje.nl)
export const tocDeelnemerData: TocData = {
  activiteiten: [
    { text: "Deelnemen aan workshops" },
    { text: "Feedback delen" },
  ],
  outputs: [
    { text: "Sociale interactie met statushouders & medewerkers" },
    { text: "Kennismaking met andere culturen" },
    { text: "Leuke belevenis met impact" },
    { text: "Teambuilding & collega's beter leren kennen" },
    { text: "Feedback deelnemers & klantrecensies" },
  ],
  directeEffecten: [
    { text: "Verbreden van culturele kennis" },
    { text: "Opdoen kennis over situatie statushouders & asielzoekers" },
    { text: "Bijdragen aan verantwoord ondernemerschap" },
    { text: "Positiever beeld over statushouders & asielzoekers" },
    { text: "Begrip voor leefsituatie statushouders & asielzoekers" },
  ],
  indirecteEffecten: [
    {
      text: "Openstaan voor statushouders en asielzoekers als collega of werknemer",
    },
    { text: "Meer inclusieve samenleving" },
  ],
};

// Connection definitions for medewerker (simplified flow)
const medewerkerConnections = [
  // Activiteiten to Outputs (general flow connections)
  { from: { col: 0, row: 0 }, to: { col: 1, row: 0 } },
  { from: { col: 0, row: 1 }, to: { col: 1, row: 1 } },
  { from: { col: 0, row: 2 }, to: { col: 1, row: 2 } },
  { from: { col: 0, row: 3 }, to: { col: 1, row: 3 } },
  { from: { col: 0, row: 4 }, to: { col: 1, row: 4 } },
  { from: { col: 0, row: 5 }, to: { col: 1, row: 5 } },
  { from: { col: 0, row: 6 }, to: { col: 1, row: 6 } },
  { from: { col: 0, row: 7 }, to: { col: 1, row: 7 } },
  // Outputs to Directe effecten
  { from: { col: 1, row: 0 }, to: { col: 2, row: 0 } },
  { from: { col: 1, row: 1 }, to: { col: 2, row: 0 } },
  { from: { col: 1, row: 2 }, to: { col: 2, row: 1 } },
  { from: { col: 1, row: 3 }, to: { col: 2, row: 2 } },
  { from: { col: 1, row: 3 }, to: { col: 2, row: 3 } },
  { from: { col: 1, row: 4 }, to: { col: 2, row: 4 } },
  { from: { col: 1, row: 5 }, to: { col: 2, row: 5 } },
  { from: { col: 1, row: 6 }, to: { col: 2, row: 6 } },
  { from: { col: 1, row: 7 }, to: { col: 2, row: 7 } },
  // Directe effecten to Indirecte effecten
  { from: { col: 2, row: 5 }, to: { col: 3, row: 0 } },
  { from: { col: 2, row: 6 }, to: { col: 3, row: 0 } },
  { from: { col: 2, row: 7 }, to: { col: 3, row: 0 } },
  { from: { col: 2, row: 8 }, to: { col: 3, row: 0 } },
  { from: { col: 2, row: 9 }, to: { col: 3, row: 0 } },
];

// Connection definitions for deelnemer
const deelnemerConnections = [
  // Activiteiten to Outputs
  { from: { col: 0, row: 0 }, to: { col: 1, row: 0 } },
  { from: { col: 0, row: 0 }, to: { col: 1, row: 1 } },
  { from: { col: 0, row: 0 }, to: { col: 1, row: 2 } },
  { from: { col: 0, row: 0 }, to: { col: 1, row: 3 } },
  { from: { col: 0, row: 1 }, to: { col: 1, row: 4 } },
  // Outputs to Directe effecten
  { from: { col: 1, row: 0 }, to: { col: 2, row: 0 } },
  { from: { col: 1, row: 1 }, to: { col: 2, row: 0 } },
  { from: { col: 1, row: 0 }, to: { col: 2, row: 1 } },
  { from: { col: 1, row: 2 }, to: { col: 2, row: 2 } },
  { from: { col: 1, row: 3 }, to: { col: 2, row: 2 } },
  { from: { col: 1, row: 1 }, to: { col: 2, row: 3 } },
  { from: { col: 1, row: 0 }, to: { col: 2, row: 4 } },
  // Directe effecten to Indirecte effecten
  { from: { col: 2, row: 3 }, to: { col: 3, row: 0 } },
  { from: { col: 2, row: 4 }, to: { col: 3, row: 0 } },
  { from: { col: 2, row: 2 }, to: { col: 3, row: 1 } },
  { from: { col: 2, row: 3 }, to: { col: 3, row: 1 } },
];

const columnColors = {
  activiteiten: {
    bg: "bg-[#8B2332]",
    border: "border-[#8B2332]",
    text: "text-white",
    itemBg: "bg-[#8B2332]/10",
    itemBorder: "border-[#8B2332]/30",
  },
  outputs: {
    bg: "bg-[#C4A24C]",
    border: "border-[#C4A24C]",
    text: "text-white",
    itemBg: "bg-[#C4A24C]/10",
    itemBorder: "border-[#C4A24C]/30",
  },
  directeEffecten: {
    bg: "bg-[#8B2332]",
    border: "border-[#8B2332]",
    text: "text-white",
    itemBg: "bg-[#8B2332]/10",
    itemBorder: "border-[#8B2332]/30",
  },
  indirecteEffecten: {
    bg: "bg-[#C4A24C]",
    border: "border-[#C4A24C]",
    text: "text-white",
    itemBg: "bg-[#C4A24C]/10",
    itemBorder: "border-[#C4A24C]/30",
  },
};

interface TheoryOfChangeProps {
  data: TocData;
  title: string;
  connections: {
    from: { col: number; row: number };
    to: { col: number; row: number };
  }[];
}

export function TheoryOfChange({
  data,
  title,
  connections,
}: TheoryOfChangeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [paths, setPaths] = useState<string[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const calculatePaths = useCallback(() => {
    if (!containerRef.current || !svgRef.current) return;

    const container = containerRef.current;
    const columns = container.querySelectorAll("[data-column]");
    const newPaths: string[] = [];

    connections.forEach((connection) => {
      const fromCol = columns[connection.from.col];
      const toCol = columns[connection.to.col];

      if (!fromCol || !toCol) return;

      const fromItems = fromCol.querySelectorAll("[data-item]");
      const toItems = toCol.querySelectorAll("[data-item]");

      const fromItem = fromItems[connection.from.row];
      const toItem = toItems[connection.to.row];

      if (!fromItem || !toItem) return;

      const containerRect = container.getBoundingClientRect();
      const fromRect = fromItem.getBoundingClientRect();
      const toRect = toItem.getBoundingClientRect();

      // Calculate positions relative to container
      const startX = fromRect.right - containerRect.left;
      const startY = fromRect.top + fromRect.height / 2 - containerRect.top;
      const endX = toRect.left - containerRect.left;
      const endY = toRect.top + toRect.height / 2 - containerRect.top;

      // Create curved path
      const midX = (startX + endX) / 2;
      const path = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
      newPaths.push(path);
    });

    setPaths(newPaths);
    setDimensions({
      width: container.offsetWidth,
      height: container.offsetHeight,
    });
  }, [connections]);

  useEffect(() => {
    if (isInView) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(calculatePaths, 100);
      return () => clearTimeout(timer);
    }
  }, [isInView, calculatePaths]);

  useEffect(() => {
    const handleResize = () => {
      if (isInView) {
        calculatePaths();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isInView, calculatePaths]);

  return (
    <div className="mb-12">
      <h3 className="text-primary mb-6 text-2xl font-bold tracking-tight">
        {title}
      </h3>

      <div ref={containerRef} className="relative overflow-x-auto">
        {/* SVG Layer for connections */}
        <svg
          ref={svgRef}
          className="pointer-events-none absolute inset-0 z-10"
          style={{ width: dimensions.width, height: dimensions.height }}
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B2332" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#C4A24C" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          {paths.map((path, index) => (
            <motion.path
              key={index}
              d={path}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{
                pathLength: {
                  delay: 0.5 + index * 0.05,
                  duration: 0.8,
                  ease: "easeInOut",
                },
                opacity: { delay: 0.5 + index * 0.05, duration: 0.3 },
              }}
            />
          ))}
        </svg>

        {/* Grid Content */}
        <div className="relative min-w-[1000px]">
          <div className="grid grid-cols-4 gap-6">
            {/* Column Headers */}
            <div
              className={`rounded-lg p-3 text-center ${columnColors.activiteiten.bg}`}
            >
              <span
                className={`text-sm font-semibold ${columnColors.activiteiten.text}`}
              >
                Activiteiten
              </span>
            </div>
            <div
              className={`rounded-lg p-3 text-center ${columnColors.outputs.bg}`}
            >
              <span
                className={`text-sm font-semibold ${columnColors.outputs.text}`}
              >
                Outputs
              </span>
            </div>
            <div
              className={`rounded-lg p-3 text-center ${columnColors.directeEffecten.bg}`}
            >
              <span
                className={`text-sm font-semibold ${columnColors.directeEffecten.text}`}
              >
                Directe effecten
              </span>
            </div>
            <div
              className={`rounded-lg p-3 text-center ${columnColors.indirecteEffecten.bg}`}
            >
              <span
                className={`text-sm font-semibold ${columnColors.indirecteEffecten.text}`}
              >
                Indirecte effecten
              </span>
            </div>

            {/* Content Columns */}
            <div data-column="0" className="space-y-2">
              {data.activiteiten.map((item, idx) => (
                <motion.div
                  key={idx}
                  data-item
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.1 + idx * 0.05, duration: 0.4 }}
                  className={`rounded-lg border p-3 text-xs ${columnColors.activiteiten.itemBg} ${columnColors.activiteiten.itemBorder}`}
                >
                  {item.text}
                </motion.div>
              ))}
            </div>

            <div data-column="1" className="space-y-2">
              {data.outputs.map((item, idx) => (
                <motion.div
                  key={idx}
                  data-item
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + idx * 0.05, duration: 0.4 }}
                  className={`rounded-lg border p-3 text-xs ${columnColors.outputs.itemBg} ${columnColors.outputs.itemBorder}`}
                >
                  {item.text}
                </motion.div>
              ))}
            </div>

            <div data-column="2" className="space-y-2">
              {data.directeEffecten.map((item, idx) => (
                <motion.div
                  key={idx}
                  data-item
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + idx * 0.05, duration: 0.4 }}
                  className={`rounded-lg border p-3 text-xs ${columnColors.directeEffecten.itemBg} ${columnColors.directeEffecten.itemBorder}`}
                >
                  {item.text}
                </motion.div>
              ))}
            </div>

            <div data-column="3" className="space-y-2">
              {data.indirecteEffecten.map((item, idx) => (
                <motion.div
                  key={idx}
                  data-item
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + idx * 0.05, duration: 0.4 }}
                  className={`rounded-lg border p-3 text-xs ${columnColors.indirecteEffecten.itemBg} ${columnColors.indirecteEffecten.itemBorder}`}
                >
                  {item.text}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Pre-configured components for easy use
export function TheoryOfChangeMedewerker() {
  return (
    <TheoryOfChange
      data={tocMedewerkerData}
      title="Theory of Change medewerker"
      connections={medewerkerConnections}
    />
  );
}

export function TheoryOfChangeDeelnemer() {
  return (
    <TheoryOfChange
      data={tocDeelnemerData}
      title="Theory of Change klant / deelnemer"
      connections={deelnemerConnections}
    />
  );
}
