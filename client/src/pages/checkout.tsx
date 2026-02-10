import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, Link } from "wouter";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  ExpressCheckoutElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, CreditCard, Loader2, ShoppingBag, Lock, Shield, CheckCircle, XCircle, Users } from "lucide-react";
import { AddressForm, emptyAddress, type AddressFormData } from "@/components/checkout/AddressForm";
import { validateEmail, validatePhone, validateAddress, validateRequired, validateState, validateZip } from "@shared/validation";
import { trackCheckoutEvent } from "@/lib/checkout-analytics";
import logoImage from "@assets/powerplungelogo_1767907611722.png";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutFormProps {
  clientSecret: string;
  orderId: string;
  cartTotal: number;
  totalWithTax: number;
  billingDetails: {
    name: string;
    email: string;
    phone: string;
    line1: string;
    line2: string;
    city: string;
    state: string;
    postalCode: string;
  };
}

function CheckoutForm({ clientSecret, orderId, cartTotal, totalWithTax, billingDetails }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    trackCheckoutEvent("payment_submitted", { cartValue: totalWithTax });

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-success?order_id=${orderId}`,
          payment_method_data: {
            billing_details: {
              name: billingDetails.name,
              email: billingDetails.email,
              phone: billingDetails.phone,
              address: {
                line1: billingDetails.line1,
                line2: billingDetails.line2 || undefined,
                city: billingDetails.city,
                state: billingDetails.state,
                postal_code: billingDetails.postalCode,
                country: "US",
              },
            },
          },
        },
        redirect: "if_required",
      });

      if (error) {
        trackCheckoutEvent("payment_failed", { error: error.message });
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      if (paymentIntent) {
        console.log("Payment intent status:", paymentIntent.status);
        
        if (paymentIntent.status === "succeeded") {
          trackCheckoutEvent("payment_succeeded", { cartValue: totalWithTax });

          const confirmResponse = await fetch("/api/confirm-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId,
              paymentIntentId: paymentIntent.id,
            }),
          });

          const confirmData = await confirmResponse.json();

          if (!confirmResponse.ok) {
            toast({
              title: "Confirmation Error",
              description: confirmData.message || "Failed to confirm payment. Please contact support.",
              variant: "destructive",
            });
            setIsProcessing(false);
            return;
          }

          const checkoutSessionId = localStorage.getItem("checkoutSessionId");
          if (checkoutSessionId) {
            fetch("/api/recovery/mark-cart-recovered", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sessionId: checkoutSessionId, orderId }),
            }).catch(() => {});
          }

          localStorage.removeItem("cart");
          localStorage.removeItem("checkoutSessionId");
          sessionStorage.removeItem("checkoutFormData");
          sessionStorage.removeItem("checkoutBillingData");
          sessionStorage.removeItem("checkoutShippingAddress");
          sessionStorage.removeItem("checkoutBillingAddress");
          setLocation(`/order-success?order_id=${orderId}`);
        } else if (paymentIntent.status === "requires_action" || paymentIntent.status === "requires_confirmation") {
          toast({
            title: "Additional Verification Required",
            description: "Please complete the verification process.",
          });
        } else if (paymentIntent.status === "processing") {
          toast({
            title: "Payment Processing",
            description: "Your payment is being processed. Please wait...",
          });
        } else {
          toast({
            title: "Payment Status",
            description: `Payment status: ${paymentIntent.status}. Please try again or contact support.`,
            variant: "destructive",
          });
        }
      } else if (!error) {
        console.log("No payment intent returned - likely redirected for authentication");
      }
    } catch (error: any) {
      trackCheckoutEvent("payment_failed", { error: error.message });
      toast({
        title: "Payment Error",
        description: error.message || "An error occurred during payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const onExpressCheckoutConfirm = async () => {
    if (!stripe || !elements) return;
    setIsProcessing(true);
    trackCheckoutEvent("payment_submitted", { cartValue: totalWithTax, method: "express" });

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-success?order_id=${orderId}`,
        },
      });

      if (error) {
        trackCheckoutEvent("payment_failed", { error: error.message, method: "express" });
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (err: any) {
      trackCheckoutEvent("payment_failed", { error: err.message, method: "express" });
      toast({
        title: "Payment Error",
        description: err.message || "An error occurred during payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-3">Express Checkout</p>
          <ExpressCheckoutElement
            onConfirm={onExpressCheckoutConfirm}
            options={{
              buttonType: {
                applePay: "buy",
                googlePay: "buy",
              },
            }}
          />
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-muted/50 px-2 text-muted-foreground">Or pay with card</span>
          </div>
        </div>

        <PaymentElement
          options={{
            layout: "tabs",
            fields: {
              billingDetails: {
                address: {
                  postalCode: "never",
                  country: "never",
                },
              },
            },
            defaultValues: {
              billingDetails: {
                address: {
                  postal_code: billingDetails.postalCode,
                  country: "US",
                },
              },
            },
          }}
        />
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Lock className="w-4 h-4" />
        <span>Your payment is secured with 256-bit SSL encryption</span>
      </div>

      <form onSubmit={handleSubmit}>
        <Button
          type="submit"
          className="w-full glow-ice-sm"
          size="lg"
          disabled={!stripe || isProcessing}
          data-testid="button-pay-now"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Pay ${(totalWithTax / 100).toLocaleString()}
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"shipping" | "payment">("shipping");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [stripePromise, setStripePromise] = useState<ReturnType<typeof loadStripe> | null>(null);
  const [taxInfo, setTaxInfo] = useState<{ subtotal: number; taxAmount: number; total: number } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [contactData, setContactData] = useState(() => {
    const defaults = { email: "", phone: "" };
    const saved = sessionStorage.getItem("checkoutFormData");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { email: parsed.email || "", phone: parsed.phone || "" };
      } catch {}
    }
    return defaults;
  });

  const [shippingAddress, setShippingAddress] = useState<AddressFormData>(() => {
    const saved = sessionStorage.getItem("checkoutShippingAddress");
    if (saved) {
      try { return { ...emptyAddress, ...JSON.parse(saved) }; } catch {}
    }
    const oldSaved = sessionStorage.getItem("checkoutFormData");
    if (oldSaved) {
      try {
        const old = JSON.parse(oldSaved);
        return {
          ...emptyAddress,
          name: old.name || "",
          line1: old.address || "",
          line2: old.address2 || "",
          city: old.city || "",
          state: old.state || "",
          postalCode: old.zipCode || "",
        };
      } catch {}
    }
    return emptyAddress;
  });

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [billingHasBeenEdited, setBillingHasBeenEdited] = useState(false);
  const [billingAddress, setBillingAddress] = useState<AddressFormData>(() => {
    const saved = sessionStorage.getItem("checkoutBillingAddress");
    if (saved) {
      try { return { ...emptyAddress, ...JSON.parse(saved) }; } catch {}
    }
    const oldSaved = sessionStorage.getItem("checkoutBillingData");
    if (oldSaved) {
      try {
        const old = JSON.parse(oldSaved);
        return {
          ...emptyAddress,
          name: old.name || "",
          line1: old.address || "",
          line2: old.address2 || "",
          city: old.city || "",
          state: old.state || "",
          postalCode: old.zipCode || "",
        };
      } catch {}
    }
    return emptyAddress;
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    sessionStorage.setItem("checkoutShippingAddress", JSON.stringify(shippingAddress));
    sessionStorage.setItem("checkoutFormData", JSON.stringify({
      name: shippingAddress.name,
      email: contactData.email,
      phone: contactData.phone,
      address: shippingAddress.line1,
      address2: shippingAddress.line2,
      city: shippingAddress.city,
      state: shippingAddress.state,
      zipCode: shippingAddress.postalCode,
    }));
  }, [shippingAddress, contactData]);

  useEffect(() => {
    sessionStorage.setItem("checkoutBillingAddress", JSON.stringify(billingAddress));
    sessionStorage.setItem("checkoutBillingData", JSON.stringify({
      name: billingAddress.name,
      address: billingAddress.line1,
      address2: billingAddress.line2,
      city: billingAddress.city,
      state: billingAddress.state,
      zipCode: billingAddress.postalCode,
    }));
  }, [billingAddress]);

  const handleBillingSameToggle = useCallback((checked: boolean) => {
    setBillingSameAsShipping(checked);
    if (!checked && !billingHasBeenEdited) {
      setBillingAddress({ ...shippingAddress });
      setBillingHasBeenEdited(true);
    }
  }, [shippingAddress, billingHasBeenEdited]);

  const clearError = useCallback((field: string) => {
    setFieldErrors(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const handleBlurValidate = useCallback((field: string, value: string) => {
    let error: string | null = null;
    const baseField = field.replace(/^billing/, "").replace(/^[A-Z]/, c => c.toLowerCase());

    switch (baseField) {
      case "name":
        error = validateRequired(value, field, "Full name")?.message || null;
        break;
      case "line1":
        error = validateRequired(value, field, "Street address", 3)?.message || null;
        break;
      case "city":
        error = validateRequired(value, field, "City")?.message || null;
        break;
      case "state":
        error = validateState(value)?.message || null;
        break;
      case "postalCode":
        error = validateZip(value)?.message || null;
        break;
      case "email":
        error = validateEmail(value)?.message || null;
        break;
      case "phone":
        error = validatePhone(value)?.message || null;
        break;
    }

    setFieldErrors(prev => {
      if (error) return { ...prev, [field]: error };
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    const emailErr = validateEmail(contactData.email);
    if (emailErr) errors.email = emailErr.message;

    const phoneErr = validatePhone(contactData.phone);
    if (phoneErr) errors.phone = phoneErr.message;

    const shippingErrors = validateAddress({
      name: shippingAddress.name,
      line1: shippingAddress.line1,
      city: shippingAddress.city,
      state: shippingAddress.state,
      postalCode: shippingAddress.postalCode,
    });
    for (const err of shippingErrors) {
      errors[err.field] = err.message;
    }

    if (!billingSameAsShipping) {
      const billingErrors = validateAddress({
        name: billingAddress.name,
        line1: billingAddress.line1,
        city: billingAddress.city,
        state: billingAddress.state,
        postalCode: billingAddress.postalCode,
      }, "billing");
      for (const err of billingErrors) {
        errors[err.field] = err.message;
      }
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      const firstErrorKey = Object.keys(errors)[0];
      trackCheckoutEvent("validation_error", { field: firstErrorKey, code: "client_validation" });
      setTimeout(() => {
        const el = document.getElementById(firstErrorKey);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.focus();
        }
      }, 100);
      return false;
    }

    return true;
  };

  const [referralCode, setReferralCode] = useState("");
  const [referralStatus, setReferralStatus] = useState<"idle" | "checking" | "valid" | "invalid">("idle");

  useEffect(() => {
    const storedCode = localStorage.getItem("affiliateCode");
    const codeExpiry = localStorage.getItem("affiliateCodeExpiry");
    if (storedCode && codeExpiry && Date.now() < parseInt(codeExpiry)) {
      setReferralCode(storedCode);
      setReferralStatus("valid");
    }
  }, []);

  const validateReferralCode = async (code: string) => {
    if (!code || code.length < 3) {
      setReferralStatus("idle");
      return;
    }
    setReferralStatus("checking");
    try {
      const res = await fetch(`/api/validate-referral-code/${encodeURIComponent(code.toUpperCase())}`);
      const data = await res.json();
      if (data.valid) {
        setReferralCode(data.code);
        setReferralStatus("valid");
        localStorage.setItem("affiliateCode", data.code);
        localStorage.setItem("affiliateCodeExpiry", String(Date.now() + 30 * 24 * 60 * 60 * 1000));
      } else {
        setReferralStatus("invalid");
      }
    } catch {
      setReferralStatus("invalid");
    }
  };

  const [cart] = useState<CartItem[]>(() => {
    try {
      const cartString = typeof window !== "undefined" ? localStorage.getItem("cart") : null;
      return cartString ? JSON.parse(cartString) : [];
    } catch {
      return [];
    }
  });
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (cart.length > 0) {
      trackCheckoutEvent("checkout_started", { cartValue: cartTotal, itemCount: cart.length });
    }
  }, []);

  useEffect(() => {
    fetch("/api/stripe/config")
      .then((res) => res.json())
      .then((data) => {
        if (data.publishableKey) {
          setStripePromise(loadStripe(data.publishableKey));
        }
      });
  }, []);

  useEffect(() => {
    if (cart.length === 0) return;

    const sessionId = localStorage.getItem("checkoutSessionId") || crypto.randomUUID();
    if (!localStorage.getItem("checkoutSessionId")) {
      localStorage.setItem("checkoutSessionId", sessionId);
    }

    let affiliateCode: string | null = null;
    const storedCode = localStorage.getItem("affiliateCode");
    const codeExpiry = localStorage.getItem("affiliateCodeExpiry");
    if (storedCode && codeExpiry && Date.now() < parseInt(codeExpiry)) {
      affiliateCode = storedCode;
    }

    const trackCart = () => {
      fetch("/api/recovery/track-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          cartData: { items: cart, subtotal: cartTotal },
          cartValue: cartTotal,
          email: contactData.email || undefined,
          affiliateCode,
        }),
      }).catch(() => {});
    };

    trackCart();
    
    const interval = setInterval(trackCart, 60000);
    return () => clearInterval(interval);
  }, [cart.length, cartTotal, contactData.email]);

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    trackCheckoutEvent("shipping_step_completed", {
      cartValue: cartTotal,
      itemCount: cart.length,
      billingSameAsShipping,
    });

    let affiliateCode: string | null = null;
    if (referralStatus === "valid" && referralCode) {
      affiliateCode = referralCode;
    } else {
      const storedCode = localStorage.getItem("affiliateCode");
      const codeExpiry = localStorage.getItem("affiliateCodeExpiry");
      if (storedCode && codeExpiry && Date.now() < parseInt(codeExpiry)) {
        affiliateCode = storedCode;
      }
    }

    const billingForSubmit = billingSameAsShipping ? null : {
      name: billingAddress.name.trim(),
      company: billingAddress.company.trim() || undefined,
      address: billingAddress.line1.trim(),
      line2: billingAddress.line2.trim() || undefined,
      city: billingAddress.city.trim(),
      state: billingAddress.state,
      zipCode: billingAddress.postalCode.trim(),
    };

    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
          customer: {
            name: shippingAddress.name.trim(),
            email: contactData.email.trim(),
            phone: contactData.phone.trim(),
            address: shippingAddress.line1.trim(),
            company: shippingAddress.company.trim() || undefined,
            line2: shippingAddress.line2.trim() || undefined,
            city: shippingAddress.city.trim(),
            state: shippingAddress.state,
            zipCode: shippingAddress.postalCode.trim(),
          },
          billingAddress: billingForSubmit,
          billingSameAsShipping,
          affiliateCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          const newErrors: Record<string, string> = {};
          for (const err of data.errors) {
            newErrors[err.field] = err.message;
            trackCheckoutEvent("validation_error", { field: err.field, code: err.code });
          }
          setFieldErrors(newErrors);
          const firstField = data.errors[0]?.field;
          if (firstField) {
            setTimeout(() => {
              const el = document.getElementById(firstField);
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
                el.focus();
              }
            }, 100);
          }
          setIsLoading(false);
          return;
        }

        if (data.field) {
          const fieldMap: Record<string, string> = {
            state: "state",
            zipCode: "postalCode",
            address: "line1",
            billingName: "billingName",
            billingAddress: "billingLine1",
            billingCity: "billingCity",
            billingState: "billingState",
            billingZip: "billingPostalCode",
          };
          const mappedField = fieldMap[data.field] || data.field;
          setFieldErrors(prev => ({ ...prev, [mappedField]: data.message }));
          trackCheckoutEvent("validation_error", { field: mappedField, code: "server_validation" });
          setTimeout(() => {
            const el = document.getElementById(mappedField);
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "center" });
              el.focus();
            }
          }, 100);
          setIsLoading(false);
          return;
        }

        throw new Error(data.message || "Failed to initialize payment");
      }

      setClientSecret(data.clientSecret);
      setOrderId(data.orderId);
      setTaxInfo({
        subtotal: data.subtotal,
        taxAmount: data.taxAmount,
        total: data.total,
      });
      setStep("payment");
      trackCheckoutEvent("payment_step_started", { cartValue: data.total, itemCount: cart.length });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!cart.length) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
        <h1 className="font-display text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Add some products before checking out.</p>
        <Link href="/">
          <Button data-testid="button-continue-shopping">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const activeBilling = billingSameAsShipping ? shippingAddress : billingAddress;

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <img src={logoImage} alt="Power Plunge" className="h-8" />
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4 text-green-500" />
            Secure Checkout
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-6 gap-2" data-testid="button-back">
            <ArrowLeft className="w-4 h-4" />
            Back to Store
          </Button>
        </Link>

        <div className="flex items-center justify-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${step === "shipping" ? "text-primary" : "text-muted-foreground"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === "shipping" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              1
            </div>
            <span className="hidden sm:inline font-medium">Shipping</span>
          </div>
          <div className="w-12 h-0.5 bg-muted" />
          <div className={`flex items-center gap-2 ${step === "payment" ? "text-primary" : "text-muted-foreground"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === "payment" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              2
            </div>
            <span className="hidden sm:inline font-medium">Payment</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === "shipping" ? (
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form ref={formRef} onSubmit={handleShippingSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={contactData.email}
                          onChange={(e) => { setContactData({ ...contactData, email: e.target.value }); clearError("email"); }}
                          onBlur={(e) => handleBlurValidate("email", e.target.value)}
                          autoComplete="email"
                          required
                          data-testid="input-email"
                        />
                        {fieldErrors.email && (
                          <p className="text-xs text-red-500 mt-1" data-testid="error-email">{fieldErrors.email}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone <span className="text-muted-foreground font-normal">(optional)</span></Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={contactData.phone}
                          onChange={(e) => { setContactData({ ...contactData, phone: e.target.value }); clearError("phone"); }}
                          onBlur={(e) => handleBlurValidate("phone", e.target.value)}
                          autoComplete="tel"
                          data-testid="input-phone"
                        />
                        {fieldErrors.phone && (
                          <p className="text-xs text-red-500 mt-1" data-testid="error-phone">{fieldErrors.phone}</p>
                        )}
                      </div>
                    </div>

                    <div className="pt-2">
                      <h4 className="font-medium text-sm mb-3">Shipping Address</h4>
                      <AddressForm
                        data={shippingAddress}
                        onChange={setShippingAddress}
                        errors={fieldErrors}
                        onClearError={clearError}
                        onBlurValidate={handleBlurValidate}
                        autoCompletePrefix="shipping"
                      />
                    </div>

                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center space-x-2 mb-4">
                        <Checkbox
                          id="billingSame"
                          checked={billingSameAsShipping}
                          onCheckedChange={(checked) => handleBillingSameToggle(checked === true)}
                          data-testid="checkbox-billing-same"
                        />
                        <Label htmlFor="billingSame" className="text-sm font-normal cursor-pointer">
                          Billing address same as shipping address
                        </Label>
                      </div>

                      {!billingSameAsShipping && (
                        <div className="space-y-4 mb-4 p-4 bg-muted/30 rounded-lg">
                          <h4 className="font-medium text-sm">Billing Address</h4>
                          <AddressForm
                            data={billingAddress}
                            onChange={(data) => { setBillingAddress(data); setBillingHasBeenEdited(true); }}
                            errors={fieldErrors}
                            onClearError={clearError}
                            onBlurValidate={handleBlurValidate}
                            fieldPrefix="billing"
                            testIdPrefix="billing"
                            autoCompletePrefix="billing"
                          />
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-border">
                      <div className="space-y-2">
                        <Label htmlFor="referralCode" className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          Referral Code (optional)
                        </Label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Input
                              id="referralCode"
                              value={referralCode}
                              onChange={(e) => {
                                setReferralCode(e.target.value.toUpperCase());
                                setReferralStatus("idle");
                              }}
                              onBlur={(e) => validateReferralCode(e.target.value)}
                              placeholder=""
                              className="uppercase"
                              data-testid="input-referral-code"
                            />
                            {referralStatus === "checking" && (
                              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
                            )}
                            {referralStatus === "valid" && (
                              <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                            )}
                            {referralStatus === "invalid" && (
                              <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => validateReferralCode(referralCode)}
                            disabled={!referralCode || referralCode.length < 3 || referralStatus === "checking"}
                            data-testid="button-apply-referral"
                          >
                            Apply
                          </Button>
                        </div>
                        {referralStatus === "valid" && (
                          <p className="text-sm text-green-600">Referral code applied!</p>
                        )}
                        {referralStatus === "invalid" && (
                          <p className="text-sm text-red-500">Invalid referral code</p>
                        )}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full mt-6 glow-ice-sm"
                      size="lg"
                      disabled={isLoading}
                      data-testid="button-continue-to-payment"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          Continue to Payment
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Payment Details
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStep("shipping")}
                      data-testid="button-edit-shipping"
                    >
                      Edit Shipping
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/30 rounded-lg p-4 mb-6">
                    <p className="text-sm text-muted-foreground mb-1">Shipping to:</p>
                    <p className="font-medium">{shippingAddress.name}</p>
                    {shippingAddress.company && <p className="text-sm text-muted-foreground">{shippingAddress.company}</p>}
                    <p className="text-sm text-muted-foreground">
                      {shippingAddress.line1}{shippingAddress.line2 ? `, ${shippingAddress.line2}` : ""}, {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
                    </p>
                    <p className="text-sm text-muted-foreground">{contactData.email}</p>
                  </div>

                  {!billingSameAsShipping && (
                    <div className="bg-muted/30 rounded-lg p-4 mb-6">
                      <p className="text-sm text-muted-foreground mb-1">Billing to:</p>
                      <p className="font-medium">{billingAddress.name}</p>
                      {billingAddress.company && <p className="text-sm text-muted-foreground">{billingAddress.company}</p>}
                      <p className="text-sm text-muted-foreground">
                        {billingAddress.line1}{billingAddress.line2 ? `, ${billingAddress.line2}` : ""}, {billingAddress.city}, {billingAddress.state} {billingAddress.postalCode}
                      </p>
                    </div>
                  )}

                  {stripePromise && clientSecret ? (
                    <Elements
                      stripe={stripePromise}
                      options={{
                        clientSecret,
                        appearance: {
                          theme: "night",
                          variables: {
                            colorPrimary: "#22d3ee",
                            colorBackground: "#1e293b",
                            colorText: "#f1f5f9",
                            colorDanger: "#ef4444",
                            fontFamily: "system-ui, sans-serif",
                            borderRadius: "8px",
                          },
                        },
                      }}
                    >
                      <CheckoutForm
                        clientSecret={clientSecret}
                        orderId={orderId!}
                        cartTotal={cartTotal}
                        totalWithTax={taxInfo?.total ?? cartTotal}
                        billingDetails={{
                          name: activeBilling.name,
                          email: contactData.email,
                          phone: contactData.phone,
                          line1: activeBilling.line1,
                          line2: activeBilling.line2,
                          city: activeBilling.city,
                          state: activeBilling.state,
                          postalCode: activeBilling.postalCode,
                        }}
                      />
                    </Elements>
                  ) : (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between py-2 border-b border-border">
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${((item.price * item.quantity) / 100).toLocaleString()}</p>
                  </div>
                ))}
                <div className="space-y-2 pt-4 border-t border-border">
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Subtotal</p>
                    <p>${((taxInfo?.subtotal ?? cartTotal) / 100).toLocaleString()}</p>
                  </div>
                  {taxInfo && taxInfo.taxAmount > 0 && (
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Sales Tax</p>
                      <p>${(taxInfo.taxAmount / 100).toFixed(2)}</p>
                    </div>
                  )}
                  <div className="flex justify-between pt-2">
                    <p className="font-semibold">Total</p>
                    <p className="font-display font-bold text-xl text-primary">
                      ${((taxInfo?.total ?? cartTotal) / 100).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border space-y-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="w-4 h-4 text-green-500" />
                    Secure SSL Encryption
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Lock className="w-4 h-4 text-green-500" />
                    Powered by Stripe
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
