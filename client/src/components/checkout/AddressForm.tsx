import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { US_STATE_OPTIONS } from "@shared/us-states";
import type { AddressFields, ValidationError } from "@shared/validation";
import { validateRequired, validateState, validateZip } from "@shared/validation";

export interface AddressFormData {
  name: string;
  company: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export const emptyAddress: AddressFormData = {
  name: "",
  company: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "US",
};

interface AddressFormProps {
  data: AddressFormData;
  onChange: (data: AddressFormData) => void;
  errors: Record<string, string>;
  onClearError: (field: string) => void;
  onBlurValidate: (field: string, value: string) => void;
  fieldPrefix?: string;
  testIdPrefix?: string;
  showEmail?: false;
  autoCompletePrefix?: string;
}

export function AddressForm({
  data,
  onChange,
  errors,
  onClearError,
  onBlurValidate,
  fieldPrefix = "",
  testIdPrefix = "",
  autoCompletePrefix = "shipping",
}: AddressFormProps) {
  const fp = fieldPrefix;
  const tp = testIdPrefix;

  const fld = (name: string) => fp ? `${fp}${name.charAt(0).toUpperCase()}${name.slice(1)}` : name;
  const tid = (name: string) => tp ? `${tp}-${name}` : name;

  const handleChange = useCallback((field: keyof AddressFormData, value: string) => {
    onChange({ ...data, [field]: value });
    onClearError(fld(field));
  }, [data, onChange, onClearError, fp]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={fld("name")}>Full Name</Label>
        <Input
          id={fld("name")}
          value={data.name}
          onChange={(e) => handleChange("name", e.target.value)}
          onBlur={(e) => onBlurValidate(fld("name"), e.target.value)}
          autoComplete={`${autoCompletePrefix} name`}
          required
          data-testid={`input-${tid("name")}`}
        />
        {errors[fld("name")] && (
          <p className="text-xs text-red-500 mt-1" data-testid={`error-${tid("name")}`}>{errors[fld("name")]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={fld("company")}>Company <span className="text-muted-foreground font-normal">(optional)</span></Label>
        <Input
          id={fld("company")}
          value={data.company}
          onChange={(e) => handleChange("company", e.target.value)}
          autoComplete={`${autoCompletePrefix} organization`}
          data-testid={`input-${tid("company")}`}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={fld("line1")}>Street Address</Label>
        <Input
          id={fld("line1")}
          value={data.line1}
          onChange={(e) => handleChange("line1", e.target.value)}
          onBlur={(e) => onBlurValidate(fld("line1"), e.target.value)}
          autoComplete={`${autoCompletePrefix} address-line1`}
          required
          placeholder="123 Main St"
          data-testid={`input-${tid("line1")}`}
        />
        {errors[fld("line1")] && (
          <p className="text-xs text-red-500 mt-1" data-testid={`error-${tid("line1")}`}>{errors[fld("line1")]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={fld("line2")}>Apt, Suite, Unit <span className="text-muted-foreground font-normal">(optional)</span></Label>
        <Input
          id={fld("line2")}
          value={data.line2}
          onChange={(e) => handleChange("line2", e.target.value)}
          autoComplete={`${autoCompletePrefix} address-line2`}
          data-testid={`input-${tid("line2")}`}
        />
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded px-3 py-2">
        <span>🇺🇸</span>
        <span>{autoCompletePrefix === "billing" ? "United States only" : "Shipping to United States only"}</span>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor={fld("city")}>City</Label>
          <Input
            id={fld("city")}
            value={data.city}
            onChange={(e) => handleChange("city", e.target.value)}
            onBlur={(e) => onBlurValidate(fld("city"), e.target.value)}
            autoComplete={`${autoCompletePrefix} address-level2`}
            required
            data-testid={`input-${tid("city")}`}
          />
          {errors[fld("city")] && (
            <p className="text-xs text-red-500 mt-1" data-testid={`error-${tid("city")}`}>{errors[fld("city")]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor={fld("state")}>State</Label>
          <Select
            value={data.state}
            onValueChange={(value) => {
              handleChange("state", value);
            }}
            required
          >
            <SelectTrigger id={fld("state")} data-testid={`select-${tid("state")}`}>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {US_STATE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors[fld("state")] && (
            <p className="text-xs text-red-500 mt-1" data-testid={`error-${tid("state")}`}>{errors[fld("state")]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor={fld("postalCode")}>ZIP Code</Label>
          <Input
            id={fld("postalCode")}
            value={data.postalCode}
            onChange={(e) => handleChange("postalCode", e.target.value)}
            onBlur={(e) => onBlurValidate(fld("postalCode"), e.target.value)}
            autoComplete={`${autoCompletePrefix} postal-code`}
            inputMode="numeric"
            placeholder="12345"
            maxLength={10}
            required
            data-testid={`input-${tid("postalCode")}`}
          />
          {errors[fld("postalCode")] && (
            <p className="text-xs text-red-500 mt-1" data-testid={`error-${tid("postalCode")}`}>{errors[fld("postalCode")]}</p>
          )}
        </div>
      </div>
    </div>
  );
}
