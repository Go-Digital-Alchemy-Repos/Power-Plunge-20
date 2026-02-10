import { normalizeState, isValidStateCode } from "./us-states";

export interface AddressFields {
  name: string;
  company?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
}

export interface ValidationError {
  field: string;
  code: string;
  message: string;
}

export function validateEmail(email: string): ValidationError | null {
  const trimmed = email.trim();
  if (!trimmed) {
    return { field: "email", code: "required", message: "Email is required" };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { field: "email", code: "invalid_format", message: "Please enter a valid email address" };
  }
  return null;
}

export function validatePhone(phone: string): ValidationError | null {
  const trimmed = phone.trim();
  if (!trimmed) return null;
  if (!/^[\d\s\-+()]{7,15}$/.test(trimmed)) {
    return { field: "phone", code: "invalid_format", message: "Please enter a valid phone number" };
  }
  return null;
}

export function validateZip(postalCode: string, fieldPrefix = ""): ValidationError | null {
  const trimmed = postalCode.trim();
  const field = fieldPrefix ? `${fieldPrefix}PostalCode` : "postalCode";
  if (!trimmed) {
    return { field, code: "required", message: "ZIP code is required" };
  }
  if (!/^\d{5}(-\d{4})?$/.test(trimmed)) {
    return { field, code: "invalid_format", message: "Valid ZIP code required (e.g. 12345)" };
  }
  return null;
}

export function validateRequired(value: string, field: string, label: string, minLength = 2): ValidationError | null {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length < minLength) {
    return { field, code: "required", message: `${label} is required${minLength > 1 ? ` (min ${minLength} characters)` : ""}` };
  }
  return null;
}

export function validateState(state: string, fieldPrefix = ""): ValidationError | null {
  const field = fieldPrefix ? `${fieldPrefix}State` : "state";
  if (!state.trim()) {
    return { field, code: "required", message: "Please select a state" };
  }
  const normalized = normalizeState(state);
  if (!normalized) {
    return { field, code: "invalid", message: "Please select a valid US state" };
  }
  return null;
}

export function validateAddress(address: AddressFields, fieldPrefix = ""): ValidationError[] {
  const errors: ValidationError[] = [];
  const p = fieldPrefix;

  const nameErr = validateRequired(address.name, p ? `${p}Name` : "name", "Full name");
  if (nameErr) errors.push(nameErr);

  const line1Err = validateRequired(address.line1, p ? `${p}Line1` : "line1", "Street address", 3);
  if (line1Err) errors.push(line1Err);

  const cityErr = validateRequired(address.city, p ? `${p}City` : "city", "City");
  if (cityErr) errors.push(cityErr);

  const stateErr = validateState(address.state, p);
  if (stateErr) errors.push(stateErr);

  const zipErr = validateZip(address.postalCode, p);
  if (zipErr) errors.push(zipErr);

  return errors;
}

export function normalizeAddress(address: AddressFields): AddressFields & { state: string } {
  return {
    name: address.name.trim(),
    company: address.company?.trim() || undefined,
    line1: address.line1.trim(),
    line2: address.line2?.trim() || undefined,
    city: address.city.trim(),
    state: normalizeState(address.state) || address.state.trim(),
    postalCode: address.postalCode.trim(),
    country: address.country?.trim() || "US",
  };
}

export { normalizeState, isValidStateCode };
