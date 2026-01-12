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

// Theory of Change data - Medewerker (from original goeduitje.nl)
// Split into 5 columns: Activiteiten, Outputs, Directe effecten (2 cols), Indirecte effecten
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

// Connection definitions for medewerker - 5 columns (0=Activiteiten, 1=Outputs, 2=DirecteL, 3=DirecteR, 4=Indirecte)
const medewerkerConnections = [
  // Activiteiten (col 0) to Outputs (col 1)
  { from: { col: 0, row: 0 }, to: { col: 1, row: 0 } },
  { from: { col: 0, row: 1 }, to: { col: 1, row: 1 } },
  { from: { col: 0, row: 2 }, to: { col: 1, row: 2 } },
  { from: { col: 0, row: 3 }, to: { col: 1, row: 3 } },
  { from: { col: 0, row: 4 }, to: { col: 1, row: 4 } },
  { from: { col: 0, row: 5 }, to: { col: 1, row: 5 } },
  { from: { col: 0, row: 6 }, to: { col: 1, row: 6 } },
  { from: { col: 0, row: 7 }, to: { col: 1, row: 7 } },
  // Outputs (col 1) to Directe effecten Left (col 2)
  { from: { col: 1, row: 0 }, to: { col: 2, row: 0 } },
  { from: { col: 1, row: 1 }, to: { col: 2, row: 0 } },
  { from: { col: 1, row: 2 }, to: { col: 2, row: 1 } },
  { from: { col: 1, row: 3 }, to: { col: 2, row: 2 } },
  { from: { col: 1, row: 3 }, to: { col: 2, row: 3 } },
  { from: { col: 1, row: 4 }, to: { col: 2, row: 4 } },
  // Outputs (col 1) to Directe effecten Right (col 3)
  { from: { col: 1, row: 5 }, to: { col: 3, row: 0 } },
  { from: { col: 1, row: 6 }, to: { col: 3, row: 1 } },
  { from: { col: 1, row: 7 }, to: { col: 3, row: 2 } },
  // Directe effecten Left (col 2) to Directe effecten Right (col 3)
  { from: { col: 2, row: 4 }, to: { col: 3, row: 3 } },
  // Directe effecten Right (col 3) to Indirecte effecten (col 4)
  { from: { col: 3, row: 0 }, to: { col: 4, row: 0 } },
  { from: { col: 3, row: 1 }, to: { col: 4, row: 0 } },
  { from: { col: 3, row: 2 }, to: { col: 4, row: 0 } },
  { from: { col: 3, row: 3 }, to: { col: 4, row: 0 } },
  { from: { col: 3, row: 4 }, to: { col: 4, row: 0 } },
];

// Connection definitions for deelnemer - 5 columns
const deelnemerConnections = [
  // Activiteiten (col 0) to Outputs (col 1)
  { from: { col: 0, row: 0 }, to: { col: 1, row: 0 } },
  { from: { col: 0, row: 0 }, to: { col: 1, row: 1 } },
  { from: { col: 0, row: 0 }, to: { col: 1, row: 2 } },
  { from: { col: 0, row: 0 }, to: { col: 1, row: 3 } },
  { from: { col: 0, row: 1 }, to: { col: 1, row: 4 } },
  // Outputs (col 1) to Directe effecten Left (col 2)
  { from: { col: 1, row: 0 }, to: { col: 2, row: 0 } },
  { from: { col: 1, row: 1 }, to: { col: 2, row: 0 } },
  { from: { col: 1, row: 0 }, to: { col: 2, row: 1 } },
  { from: { col: 1, row: 3 }, to: { col: 2, row: 2 } },
  // Outputs (col 1) to Directe effecten Right (col 3)
  { from: { col: 1, row: 1 }, to: { col: 3, row: 0 } },
  { from: { col: 1, row: 0 }, to: { col: 3, row: 1 } },
  // Directe effecten Right (col 3) to Indirecte effecten (col 4)
  { from: { col: 3, row: 0 }, to: { col: 4, row: 0 } },
  { from: { col: 3, row: 1 }, to: { col: 4, row: 0 } },
  { from: { col: 2, row: 2 }, to: { col: 4, row: 1 } },
  { from: { col: 3, row: 0 }, to: { col: 4, row: 1 } },
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
  const svgRef = useRef<SVGSVGElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [paths, setPaths] = useState<string[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [uniqueId] = useState(() => Math.random().toString(36).substr(2, 9));

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

      // Create curved path with control points for smooth curves
      const deltaX = endX - startX;
      const controlOffset = Math.min(deltaX * 0.4, 40);
      const path = `M ${startX} ${startY} C ${startX + controlOffset} ${startY}, ${endX - controlOffset} ${endY}, ${endX} ${endY}`;
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
      const timer = setTimeout(calculatePaths, 150);
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

  // Item component for consistent styling
  const Item = ({
    text,
    colorKey,
    delay,
  }: {
    text: string;
    colorKey: keyof typeof columnColors;
    delay: number;
  }) => (
    <motion.div
      data-item
      initial={{ opacity: 0, x: -10 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay, duration: 0.3 }}
      className={`rounded px-2 py-1.5 text-center text-[9px] leading-tight xl:text-[10px] ${columnColors[colorKey].itemBg} ${columnColors[colorKey].itemText}`}
    >
      {text}
    </motion.div>
  );

  return (
    <div className="mb-10">
      <h3 className="text-primary mb-4 text-xl font-bold tracking-tight lg:text-2xl">
        {title}
      </h3>

      {/* Scrollable on mobile, full width on desktop */}
      <div
        ref={containerRef}
        className="relative overflow-x-auto xl:overflow-x-visible"
      >
        {/* SVG Layer for connections */}
        <svg
          ref={svgRef}
          className="pointer-events-none absolute inset-0 z-10"
          style={{ width: dimensions.width, height: dimensions.height }}
        >
          <defs>
            <linearGradient
              id={`lineGradient-${uniqueId}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#6B5B47" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#8B2332" stopOpacity="0.7" />
            </linearGradient>
          </defs>
          {paths.map((path, index) => (
            <motion.path
              key={index}
              d={path}
              fill="none"
              stroke={`url(#lineGradient-${uniqueId})`}
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{
                pathLength: {
                  delay: 0.3 + index * 0.02,
                  duration: 0.5,
                  ease: "easeInOut",
                },
                opacity: { delay: 0.3 + index * 0.02, duration: 0.2 },
              }}
            />
          ))}
        </svg>

        {/* 5-Column Grid Layout */}
        <div className="relative min-w-[1000px] xl:min-w-0">
          {/* Headers Row */}
          <div className="mb-3 grid grid-cols-[1fr_1fr_2fr_1fr] gap-8">
            <div
              className={`rounded px-2 py-2 text-center ${columnColors.activiteiten.bg}`}
            >
              <span
                className={`text-xs font-semibold ${columnColors.activiteiten.text}`}
              >
                Activiteiten
              </span>
            </div>
            <div
              className={`rounded px-2 py-2 text-center ${columnColors.outputs.bg}`}
            >
              <span
                className={`text-xs font-semibold ${columnColors.outputs.text}`}
              >
                Outputs
              </span>
            </div>
            <div
              className={`rounded px-2 py-2 text-center ${columnColors.directeEffecten.bg}`}
            >
              <span
                className={`text-xs font-semibold ${columnColors.directeEffecten.text}`}
              >
                Directe effecten
              </span>
            </div>
            <div
              className={`rounded px-2 py-2 text-center ${columnColors.indirecteEffecten.bg}`}
            >
              <span
                className={`text-xs font-semibold ${columnColors.indirecteEffecten.text}`}
              >
                Indirecte effecten
              </span>
            </div>
          </div>

          {/* Content Row - 5 actual data columns */}
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] gap-6">
            {/* Column 0: Activiteiten */}
            <div data-column="0" className="flex flex-col gap-2">
              {data.activiteiten.map((item, idx) => (
                <Item
                  key={idx}
                  text={item.text}
                  colorKey="activiteiten"
                  delay={0.1 + idx * 0.02}
                />
              ))}
            </div>

            {/* Column 1: Outputs */}
            <div data-column="1" className="flex flex-col gap-2">
              {data.outputs.map((item, idx) => (
                <Item
                  key={idx}
                  text={item.text}
                  colorKey="outputs"
                  delay={0.15 + idx * 0.02}
                />
              ))}
            </div>

            {/* Column 2: Directe effecten Left */}
            <div data-column="2" className="flex flex-col gap-2 pt-4">
              {data.directeEffectenLeft.map((item, idx) => (
                <Item
                  key={idx}
                  text={item.text}
                  colorKey="directeEffecten"
                  delay={0.2 + idx * 0.02}
                />
              ))}
            </div>

            {/* Column 3: Directe effecten Right */}
            <div data-column="3" className="flex flex-col gap-2">
              {data.directeEffectenRight.map((item, idx) => (
                <Item
                  key={idx}
                  text={item.text}
                  colorKey="directeEffecten"
                  delay={0.25 + idx * 0.02}
                />
              ))}
            </div>

            {/* Column 4: Indirecte effecten */}
            <div data-column="4" className="flex flex-col gap-2 pt-8">
              {data.indirecteEffecten.map((item, idx) => (
                <Item
                  key={idx}
                  text={item.text}
                  colorKey="indirecteEffecten"
                  delay={0.3 + idx * 0.02}
                />
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
