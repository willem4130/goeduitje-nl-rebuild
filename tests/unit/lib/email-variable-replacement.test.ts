import { describe, it, expect } from "vitest";

// Mirror the replaceVariables function from src/app/api/send-email/route.ts
function replaceVariables(
  template: string,
  data: Record<string, unknown>
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const value = data[key];
    if (value === undefined || value === null) return "";
    if (Array.isArray(value)) return value.join(", ");
    return String(value);
  });
}

describe("Email variable replacement", () => {
  it("replaces simple string variables", () => {
    const result = replaceVariables("Hallo {name}", { name: "Jan" });
    expect(result).toBe("Hallo Jan");
  });

  it("replaces multiple variables", () => {
    const result = replaceVariables("{greeting} {name}, je uitje op {date}", {
      greeting: "Hallo",
      name: "Jan",
      date: "15 april",
    });
    expect(result).toBe("Hallo Jan, je uitje op 15 april");
  });

  it("replaces array variables with comma-separated values", () => {
    const result = replaceVariables("Uitjes: {workshops}", {
      workshops: ["Kookworkshop", "Stadsspel"],
    });
    expect(result).toBe("Uitjes: Kookworkshop, Stadsspel");
  });

  it("replaces null variables with empty string", () => {
    const result = replaceVariables("Bedrijf: {companyName}", {
      companyName: null,
    });
    expect(result).toBe("Bedrijf: ");
  });

  it("replaces missing variables with empty string", () => {
    const result = replaceVariables("Bedrijf: {companyName}", {});
    expect(result).toBe("Bedrijf: ");
  });

  it("replaces number variables as strings", () => {
    const result = replaceVariables("{count} personen", { count: 10 });
    expect(result).toBe("10 personen");
  });

  it("handles template with no variables", () => {
    const result = replaceVariables("Geen variabelen hier", { name: "Jan" });
    expect(result).toBe("Geen variabelen hier");
  });

  it("handles empty template", () => {
    const result = replaceVariables("", { name: "Jan" });
    expect(result).toBe("");
  });
});
