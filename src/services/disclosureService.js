import { fetchXMLText } from "./rssService";
import { parseXbrl } from "../utils/parseXbrl";
import { getDisclosureType } from "../utils/getDisclosureType";
import { normalizeDisclosure } from "../utils/normalizeDisclosure";

export async function getDisclosureFromXmlUrl(url) {
  const xml = await fetchXMLText(url);
  const raw = parseXbrl(xml);
  const type = getDisclosureType(raw);
  const disclosure = normalizeDisclosure(raw, type);

  return {
    raw,
    type,
    disclosure,
  };
}
