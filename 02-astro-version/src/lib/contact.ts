// One source for contact details: ⚙️ settings.json -> contact / schema. Every page, schema and llms.txt reads from here.
import settings from "../data/settings.json";

const c = settings.contact;
const digits = (p: string) => p.replace(/\D/g, "");
// "095-424-1968" -> "+66954241968" / "+66-95-424-1968"
const e164 = (p: string) => "+66" + digits(p).replace(/^0/, "");
const intl = (p: string) => "+66-" + p.trim().replace(/^0/, "");
// Append UTM params whether or not the URL already has a query string
export const withQuery = (url: string, qs: string) => url + (url.includes("?") ? "&" : "?") + qs;

export const SITE = new URL(settings.canonicalUrl).origin;
export const contact = {
  ...c,
  tel: "tel:" + e164(c.phoneDisplay),
  tel2: "tel:" + e164(c.phoneSecondary),
  phoneDigits: digits(c.phoneDisplay),
  phoneIntl: intl(c.phoneDisplay),
  phone2Intl: intl(c.phoneSecondary),
  legalName: settings.schema.legalName,
  taxID: settings.schema.taxID,
};

// Tokens used in src/schema/home.json (__X__) and the llms.txt templates ({{X}})
const tokens: Record<string, string> = {
  SITE,
  PHONE: c.phoneDisplay,
  PHONE_INTL: contact.phoneIntl,
  PHONE_NAME: c.phoneName,
  PHONE_NAME_EN: c.phoneNameEn,
  PHONE2: c.phoneSecondary,
  PHONE2_INTL: contact.phone2Intl,
  PHONE2_NAME: c.phoneSecondaryName,
  PHONE2_NAME_EN: c.phoneSecondaryNameEn,
  EMAIL: c.email,
  LINE_URL: c.lineUrl,
  FACEBOOK_URL: c.facebookUrl,
  MAPS_URL: c.googleMapsUrl,
  TAX_ID: contact.taxID,
  RATING: settings.schema.ratingValue,
  GEO_LAT: String(settings.schema.geoLat),
  GEO_LNG: String(settings.schema.geoLng),
  REVIEW_COUNT: settings.schema.reviewCount,
};
export const fillTokens = (text: string, open: string, close: string, escape = (v: string) => v) =>
  Object.entries(tokens).reduce((t, [k, v]) => t.replaceAll(open + k + close, escape(String(v ?? ""))), text);
// Schema JSON: coordinates must stay numbers, so their quoted tokens are swapped first
export const fillSchema = (json: string) =>
  fillTokens(
    json.replace('"__GEO_LAT__"', String(Number(settings.schema.geoLat))).replace('"__GEO_LNG__"', String(Number(settings.schema.geoLng))),
    "__", "__", (v) => JSON.stringify(v).slice(1, -1)
  );
