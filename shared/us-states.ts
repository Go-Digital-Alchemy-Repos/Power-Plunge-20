export const US_STATES: Record<string, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
  DC: "District of Columbia",
};

const NAME_TO_CODE: Record<string, string> = {};
for (const [code, name] of Object.entries(US_STATES)) {
  NAME_TO_CODE[name.toUpperCase()] = code;
}

export function normalizeState(input: string): string | null {
  const trimmed = input.trim().toUpperCase();
  if (!trimmed) return null;

  if (US_STATES[trimmed]) {
    return trimmed;
  }

  const code = NAME_TO_CODE[trimmed];
  if (code) {
    return code;
  }

  return null;
}

export function isValidStateCode(code: string): boolean {
  return !!US_STATES[code.trim().toUpperCase()];
}

export const US_STATE_OPTIONS = Object.entries(US_STATES).map(([code, name]) => ({
  value: code,
  label: `${code} - ${name}`,
}));
