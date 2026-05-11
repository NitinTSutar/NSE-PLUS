import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  removeNSPrefix: true,
  parseTagValue: false,
  trimValues: true,
});

export function parseXbrl(xmlString) {
  const parsed = parser.parse(xmlString);
  const root = parsed?.xbrl;

  if (!root || typeof root !== "object") {
    throw new Error("Invalid XBRL document: missing xbrl root node.");
  }

  const result = {};

  Object.keys(root).forEach((key) => {
    const value = root[key];

    if (key === "context" || key === "unit" || key === "schemaRef") {
      return;
    }

    if (Array.isArray(value)) {
      const flattened = value
        .map((item) => {
          if (typeof item === "object" && item !== null && "#text" in item) {
            return item["#text"];
          }
          if (typeof item !== "object") {
            return item;
          }
          return null;
        })
        .filter((item) => item !== null && item !== undefined && item !== "");

      if (flattened.length > 0) {
        result[key] = flattened.join(", ");
      }
      return;
    }

    if (typeof value === "object" && value !== null && "#text" in value) {
      result[key] = value["#text"];
    } else if (typeof value !== "object") {
      result[key] = value;
    }
  });

  return result;
}
