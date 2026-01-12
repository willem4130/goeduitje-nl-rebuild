"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";

interface TocItem {
  text: string;
}

interface TocData {
  activiteiten: TocItem[];
  outputs: TocItem[];
  directeEffectenLeft: TocItem[];
  directeEffectenRight: TocItem[];
  indirecteEffecten: TocItem[];
}

// Theory of Change data - Medewerker
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
  directeEffectenLeft: [
    { text: "Ontwikkelen algemene vaardigheden" },
    { text: "Ontwikkelen werkspecifieke vaardigheden" },
    { text: "Eigen maken Nederlandse taal" },
    { text: "Opbouwen netwerk" },
    { text: "Eigen maken Nederlandse werkcultuur" },
  ],
  directeEffectenRight: [
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

// Theory of Change data - Klant/Deelnemer
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
  directeEffectenLeft: [
    { text: "Verbreden van culturele kennis" },
    { text: "Opdoen kennis over situatie statushouders & asielzoekers" },
    { text: "Bijdragen aan verantwoord ondernemerschap" },
  ],
  directeEffectenRight: [
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

// Connection definitions for medewerker - 5 columns
// Based on original goeduitje.nl diagram
const medewerkerConnections = [
  // Activiteiten (col 0) → Outputs (col 1) - 1:1 mapping
  { from: { col: 0, row: 0 }, to: { col: 1, row: 0 } },
  { from: { col: 0, row: 1 }, to: { col: 1, row: 1 } },
  { from: { col: 0, row: 2 }, to: { col: 1, row: 2 } },
  { from: { col: 0, row: 3 }, to: { col: 1, row: 3 } },
  { from: { col: 0, row: 4 }, to: { col: 1, row: 4 } },
  { from: { col: 0, row: 5 }, to: { col: 1, row: 5 } },
  { from: { col: 0, row: 6 }, to: { col: 1, row: 6 } },
  { from: { col: 0, row: 7 }, to: { col: 1, row: 7 } },
  // Outputs (col 1) → Directe effecten Left (col 2)
  { from: { col: 1, row: 0 }, to: { col: 2, row: 0 } }, // Workshop opzet → Algemene vaardigheden
  { from: { col: 1, row: 1 }, to: { col: 2, row: 0 } }, // Boodschappenlijst → Algemene vaardigheden
  { from: { col: 1, row: 2 }, to: { col: 2, row: 1 } }, // Structuur & ritme → Werkspecifieke
  { from: { col: 1, row: 3 }, to: { col: 2, row: 2 } }, // Sociale interactie → Nederlandse taal
  { from: { col: 1, row: 3 }, to: { col: 2, row: 3 } }, // Sociale interactie → Opbouwen netwerk
  { from: { col: 1, row: 4 }, to: { col: 2, row: 4 } }, // Feedback → Nederlandse werkcultuur
  // Outputs (col 1) → Directe effecten Right (col 3)
  { from: { col: 1, row: 5 }, to: { col: 3, row: 0 } }, // Evaluatieverslag → Persoonlijke ontwikkeling
  { from: { col: 1, row: 6 }, to: { col: 3, row: 1 } }, // Content calender → Arbeidsmarkt
  { from: { col: 1, row: 7 }, to: { col: 3, row: 2 } }, // Inventarisatie → Zelfvertrouwen
  // Directe effecten Left (col 2) → Right (col 3)
  { from: { col: 2, row: 4 }, to: { col: 3, row: 3 } }, // Nederlandse werkcultuur → Positieve ervaring
  { from: { col: 2, row: 4 }, to: { col: 3, row: 4 } }, // Nederlandse werkcultuur → Financiele situatie
  // Directe effecten Right (col 3) → Indirecte effecten (col 4) - all converge
  { from: { col: 3, row: 0 }, to: { col: 4, row: 0 } },
  { from: { col: 3, row: 1 }, to: { col: 4, row: 0 } },
  { from: { col: 3, row: 2 }, to: { col: 4, row: 0 } },
  { from: { col: 3, row: 3 }, to: { col: 4, row: 0 } },
  { from: { col: 3, row: 4 }, to: { col: 4, row: 0 } },
];

// Connection definitions for deelnemer - 5 columns
// Based on original goeduitje.nl diagram
const deelnemerConnections = [
  // Activiteiten (col 0) → Outputs (col 1)
  { from: { col: 0, row: 0 }, to: { col: 1, row: 0 } }, // Deelnemen → Sociale interactie
  { from: { col: 0, row: 0 }, to: { col: 1, row: 1 } }, // Deelnemen → Kennismaking
  { from: { col: 0, row: 0 }, to: { col: 1, row: 2 } }, // Deelnemen → Leuke belevenis
  { from: { col: 0, row: 0 }, to: { col: 1, row: 3 } }, // Deelnemen → Teambuilding
  { from: { col: 0, row: 1 }, to: { col: 1, row: 4 } }, // Feedback delen → Feedback deelnemers
  // Outputs (col 1) → Directe effecten Left (col 2)
  { from: { col: 1, row: 0 }, to: { col: 2, row: 0 } }, // Sociale interactie → Verbreden culturele kennis
  { from: { col: 1, row: 1 }, to: { col: 2, row: 0 } }, // Kennismaking → Verbreden culturele kennis
  { from: { col: 1, row: 0 }, to: { col: 2, row: 1 } }, // Sociale interactie → Opdoen kennis
  { from: { col: 1, row: 3 }, to: { col: 2, row: 2 } }, // Teambuilding → Bijdragen ondernemerschap
  // Outputs (col 1) → Directe effecten Right (col 3)
  { from: { col: 1, row: 1 }, to: { col: 3, row: 0 } }, // Kennismaking → Positiever beeld
  { from: { col: 1, row: 2 }, to: { col: 3, row: 1 } }, // Leuke belevenis → Begrip leefsituatie
  // Directe effecten Left (col 2) → Right (col 3)
  { from: { col: 2, row: 1 }, to: { col: 3, row: 0 } }, // Opdoen kennis → Positiever beeld
  // Directe effecten → Indirecte effecten (col 4)
  { from: { col: 3, row: 0 }, to: { col: 4, row: 0 } }, // Positiever beeld → Openstaan
  { from: { col: 3, row: 1 }, to: { col: 4, row: 0 } }, // Begrip → Openstaan
  { from: { col: 2, row: 2 }, to: { col: 4, row: 1 } }, // Bijdragen ondernemerschap → Meer inclusieve
  { from: { col: 3, row: 0 }, to: { col: 4, row: 1 } }, // Positiever beeld → Meer inclusieve
];

const columnColors = {
  activiteiten: {
    bg: "bg-[#8B7355]",
    text: "text-white",
    itemBg: "bg-[#8B7355]",
    itemText: "text-white",
  },
  outputs: {
    bg: "bg-[#8B7355]",
    text: "text-white",
    itemBg: "bg-[#8B7355]",
    itemText: "text-white",
  },
  directeEffecten: {
    bg: "bg-[#8B2332]",
    text: "text-white",
    itemBg: "bg-[#8B2332]",
    itemText: "text-white",
  },
  indirecteEffecten: {
    bg: "bg-[#C4A24C]",
    text: "text-white",
    itemBg: "bg-[#C4A24C]",
    itemText: "text-white",
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
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });
  const [paths, setPaths] = useState<string[]>([]);
  const [uniqueId] = useState(() => Math.random().toString(36).substr(2, 9));

  const calculatePaths = useCallback(() => {
    if (!contentRef.current) return;

    const content = contentRef.current;
    const columns = content.querySelectorAll("[data-column]");
    const newPaths: string[] = [];

    const contentRect = content.getBoundingClientRect();

    connections.forEach((connection) => {
      const fromCol = columns[connection.from.col];
      const toCol = columns[connection.to.col];

      if (!fromCol || !toCol) return;

      const fromItems = fromCol.querySelectorAll("[data-item]");
      const toItems = toCol.querySelectorAll("[data-item]");

      const fromItem = fromItems[connection.from.row];
      const toItem = toItems[connection.to.row];

      if (!fromItem || !toItem) return;

      const fromRect = fromItem.getBoundingClientRect();
      const toRect = toItem.getBoundingClientRect();

      // Calculate positions relative to content container
      const startX = fromRect.right - contentRect.left;
      const startY = fromRect.top + fromRect.height / 2 - contentRect.top;
      const endX = toRect.left - contentRect.left;
      const endY = toRect.top + toRect.height / 2 - contentRect.top;

      // Create smooth bezier curve
      const deltaX = endX - startX;
      const controlX = deltaX * 0.5;
      const path = `M ${startX} ${startY} C ${startX + controlX} ${startY}, ${endX - controlX} ${endY}, ${endX} ${endY}`;
      newPaths.push(path);
    });

    setPaths(newPaths);
  }, [connections]);

  useEffect(() => {
    if (isInView) {
      // Longer delay to ensure DOM is fully rendered
      const timer = setTimeout(calculatePaths, 300);
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

  // Recalculate when data changes
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(calculatePaths, 100);
      return () => clearTimeout(timer);
    }
  }, [data, isInView, calculatePaths]);

  return (
    <div ref={containerRef} className="mb-12">
      <h3 className="text-primary mb-6 text-xl font-bold tracking-tight lg:text-2xl">
        {title}
      </h3>

      {/* Content wrapper - no scroll on desktop */}
      <div ref={contentRef} className="relative">
        {/* SVG Layer for connections */}
        <svg
          className="pointer-events-none absolute inset-0 z-20 overflow-visible"
          width="100%"
          height="100%"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id={`gradient-${uniqueId}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#5D4E7A" />
              <stop offset="100%" stopColor="#7B6B9A" />
            </linearGradient>
          </defs>
          {paths.map((pathD, index) => (
            <path
              key={`${uniqueId}-${index}`}
              d={pathD}
              fill="none"
              stroke="#5D4E7A"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.8"
            />
          ))}
        </svg>

        {/* Headers Row */}
        <div className="relative z-10 mb-4 grid grid-cols-[1fr_1fr_2fr_1fr] gap-6">
          <div
            className={`rounded px-3 py-2 text-center ${columnColors.activiteiten.bg}`}
          >
            <span
              className={`text-sm font-semibold ${columnColors.activiteiten.text}`}
            >
              Activiteiten
            </span>
          </div>
          <div
            className={`rounded px-3 py-2 text-center ${columnColors.outputs.bg}`}
          >
            <span
              className={`text-sm font-semibold ${columnColors.outputs.text}`}
            >
              Outputs
            </span>
          </div>
          <div
            className={`rounded px-3 py-2 text-center ${columnColors.directeEffecten.bg}`}
          >
            <span
              className={`text-sm font-semibold ${columnColors.directeEffecten.text}`}
            >
              Directe effecten
            </span>
          </div>
          <div
            className={`rounded px-3 py-2 text-center ${columnColors.indirecteEffecten.bg}`}
          >
            <span
              className={`text-sm font-semibold ${columnColors.indirecteEffecten.text}`}
            >
              Indirecte effecten
            </span>
          </div>
        </div>

        {/* Content - 5 data columns */}
        <div className="relative z-10 grid grid-cols-[1fr_1fr_1fr_1fr_1fr] gap-6">
          {/* Column 0: Activiteiten */}
          <div data-column="0" className="flex flex-col gap-2">
            {data.activiteiten.map((item, idx) => (
              <motion.div
                key={idx}
                data-item
                initial={{ opacity: 0, x: -15 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.05 + idx * 0.02, duration: 0.3 }}
                className={`rounded px-2 py-2 text-center text-[10px] leading-snug xl:text-[11px] ${columnColors.activiteiten.itemBg} ${columnColors.activiteiten.itemText}`}
              >
                {item.text}
              </motion.div>
            ))}
          </div>

          {/* Column 1: Outputs */}
          <div data-column="1" className="flex flex-col gap-2">
            {data.outputs.map((item, idx) => (
              <motion.div
                key={idx}
                data-item
                initial={{ opacity: 0, x: -15 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.1 + idx * 0.02, duration: 0.3 }}
                className={`rounded px-2 py-2 text-center text-[10px] leading-snug xl:text-[11px] ${columnColors.outputs.itemBg} ${columnColors.outputs.itemText}`}
              >
                {item.text}
              </motion.div>
            ))}
          </div>

          {/* Column 2: Directe effecten Left */}
          <div data-column="2" className="flex flex-col gap-2 pt-6">
            {data.directeEffectenLeft.map((item, idx) => (
              <motion.div
                key={idx}
                data-item
                initial={{ opacity: 0, x: -15 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.15 + idx * 0.02, duration: 0.3 }}
                className={`rounded px-2 py-2 text-center text-[10px] leading-snug xl:text-[11px] ${columnColors.directeEffecten.itemBg} ${columnColors.directeEffecten.itemText}`}
              >
                {item.text}
              </motion.div>
            ))}
          </div>

          {/* Column 3: Directe effecten Right */}
          <div data-column="3" className="flex flex-col gap-2 pt-2">
            {data.directeEffectenRight.map((item, idx) => (
              <motion.div
                key={idx}
                data-item
                initial={{ opacity: 0, x: -15 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + idx * 0.02, duration: 0.3 }}
                className={`rounded px-2 py-2 text-center text-[10px] leading-snug xl:text-[11px] ${columnColors.directeEffecten.itemBg} ${columnColors.directeEffecten.itemText}`}
              >
                {item.text}
              </motion.div>
            ))}
          </div>

          {/* Column 4: Indirecte effecten */}
          <div data-column="4" className="flex flex-col gap-2 pt-10">
            {data.indirecteEffecten.map((item, idx) => (
              <motion.div
                key={idx}
                data-item
                initial={{ opacity: 0, x: -15 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.25 + idx * 0.02, duration: 0.3 }}
                className={`rounded px-2 py-2 text-center text-[10px] leading-snug xl:text-[11px] ${columnColors.indirecteEffecten.itemBg} ${columnColors.indirecteEffecten.itemText}`}
              >
                {item.text}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Pre-configured components
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
