import {
  Checkout,
  Step1Values,
  Step2Values,
  Step3Values,
} from "$/pages/checkout/hooks";
import clsx from "clsx";
import type { ReactNode } from "react";

function StepIcon({ status }: { status: Checkout[keyof Checkout] }) {
  if (status === "passed") {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M20 6 9 17l-5-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  if (status === "pending") {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-foreground">
        <span className="h-2 w-2 rounded-full bg-primary" />
      </span>
    );
  }

  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground">
      <span className="h-2 w-2 rounded-full bg-muted-foreground/60" />
    </span>
  );
}

export function CheckoutPageLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-[100dvh] bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10">{children}</div>
    </div>
  );
}

export function CheckoutStepper({
  checkout,
  activeStep,
  canOpenStep,
  openStep,
}: {
  checkout: Checkout;
  activeStep: 1 | 2 | 3;
  canOpenStep: (step: 1 | 2 | 3) => boolean;
  openStep: (step: 1 | 2 | 3) => void;
}) {
  const steps: Array<{
    id: 1 | 2 | 3;
    title: string;
    description: string;
    status: Checkout[keyof Checkout];
  }> = [
    {
      id: 1,
      title: "Buyer & address",
      description: "Contact, shipping and billing",
      status: checkout.step1,
    },
    {
      id: 2,
      title: "Delivery",
      description: "Choose your shipping method",
      status: checkout.step2,
    },
    {
      id: 3,
      title: "Payment",
      description: "Select a payment method",
      status: checkout.step3,
    },
  ];

  return (
    <ol className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {steps.map((step) => {
        const isClickable = canOpenStep(step.id);
        const isActive = activeStep === step.id;

        return (
          <li key={step.id}>
            <button
              type="button"
              onClick={() => openStep(step.id)}
              disabled={!isClickable}
              className={clsx(
                "w-full rounded-2xl border px-4 py-4 text-left transition",
                isActive
                  ? "border-primary bg-card shadow-sm"
                  : "border-border bg-card",
                isClickable
                  ? "hover:bg-accent hover:text-accent-foreground"
                  : "opacity-60 cursor-not-allowed"
              )}
            >
              <div className="flex items-start gap-3">
                <StepIcon status={step.status} />
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold tracking-tight">
                      Step {step.id}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {step.status}
                    </span>
                  </div>
                  <div className="mt-1 font-medium leading-tight">
                    {step.title}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {step.description}
                  </div>
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
      {message}
    </div>
  );
}

export function StepCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="border-b border-border px-6 py-5">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

export function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  name,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  name?: string;
}) {
  return (
    <label className="space-y-1">
      <span className="text-sm font-medium">{label}</span>
      <input
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        required={required}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm shadow-sm placeholder:text-muted-foreground focus:ring-2 ring-ring"
      />
    </label>
  );
}

export function DividerTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-border" />
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

export function RadioCards({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ id: string; title: string; description: string; meta: string }>;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {options.map((opt) => {
        const isActive = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={clsx(
              "rounded-2xl border px-4 py-4 text-left",
              isActive
                ? "border-primary bg-card shadow-sm"
                : "border-border bg-card hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium leading-tight">{opt.title}</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {opt.description}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">{opt.meta}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function Step1Form({
  values,
  onChange,
  onSubmit,
  disabled,
}: {
  values: Step1Values;
  onChange: (updater: (prev: Step1Values) => Step1Values) => void;
  onSubmit: () => Promise<void>;
  disabled: boolean;
}) {
  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField
          label="First name"
          value={values.buyer.firstName}
          onChange={(v) =>
            onChange((prev) => ({
              ...prev,
              buyer: { ...prev.buyer, firstName: v },
            }))
          }
          required
          name="firstName"
        />
        <TextField
          label="Last name"
          value={values.buyer.lastName}
          onChange={(v) =>
            onChange((prev) => ({
              ...prev,
              buyer: { ...prev.buyer, lastName: v },
            }))
          }
          required
          name="lastName"
        />
        <TextField
          label="Email"
          value={values.buyer.email}
          onChange={(v) =>
            onChange((prev) => ({
              ...prev,
              buyer: { ...prev.buyer, email: v },
            }))
          }
          required
          type="email"
          name="email"
        />
        <TextField
          label="Phone"
          value={values.buyer.phone}
          onChange={(v) =>
            onChange((prev) => ({
              ...prev,
              buyer: { ...prev.buyer, phone: v },
            }))
          }
          required
          name="phone"
        />
      </div>

      <DividerTitle title="Shipping address" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <TextField
            label="Address line 1"
            value={values.shippingAddress.line1}
            onChange={(v) =>
              onChange((prev) => ({
                ...prev,
                shippingAddress: { ...prev.shippingAddress, line1: v },
              }))
            }
            required
            name="shippingLine1"
          />
        </div>
        <div className="sm:col-span-2">
          <TextField
            label="Address line 2"
            value={values.shippingAddress.line2}
            onChange={(v) =>
              onChange((prev) => ({
                ...prev,
                shippingAddress: { ...prev.shippingAddress, line2: v },
              }))
            }
            name="shippingLine2"
          />
        </div>
        <TextField
          label="City"
          value={values.shippingAddress.city}
          onChange={(v) =>
            onChange((prev) => ({
              ...prev,
              shippingAddress: { ...prev.shippingAddress, city: v },
            }))
          }
          required
          name="shippingCity"
        />
        <TextField
          label="Postal code"
          value={values.shippingAddress.postalCode}
          onChange={(v) =>
            onChange((prev) => ({
              ...prev,
              shippingAddress: { ...prev.shippingAddress, postalCode: v },
            }))
          }
          required
          name="shippingPostalCode"
        />
        <TextField
          label="Country"
          value={values.shippingAddress.country}
          onChange={(v) =>
            onChange((prev) => ({
              ...prev,
              shippingAddress: { ...prev.shippingAddress, country: v },
            }))
          }
          required
          name="shippingCountry"
        />
      </div>

      <DividerTitle title="Billing address" />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={values.billingSameAsShipping}
          onChange={(e) =>
            onChange((prev) => ({
              ...prev,
              billingSameAsShipping: e.target.checked,
            }))
          }
        />
        <span>Billing address is the same as shipping</span>
      </label>

      {!values.billingSameAsShipping ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <TextField
              label="Address line 1"
              value={values.billingAddress.line1}
              onChange={(v) =>
                onChange((prev) => ({
                  ...prev,
                  billingAddress: { ...prev.billingAddress, line1: v },
                }))
              }
              required
              name="billingLine1"
            />
          </div>
          <div className="sm:col-span-2">
            <TextField
              label="Address line 2"
              value={values.billingAddress.line2}
              onChange={(v) =>
                onChange((prev) => ({
                  ...prev,
                  billingAddress: { ...prev.billingAddress, line2: v },
                }))
              }
              name="billingLine2"
            />
          </div>
          <TextField
            label="City"
            value={values.billingAddress.city}
            onChange={(v) =>
              onChange((prev) => ({
                ...prev,
                billingAddress: { ...prev.billingAddress, city: v },
              }))
            }
            required
            name="billingCity"
          />
          <TextField
            label="Postal code"
            value={values.billingAddress.postalCode}
            onChange={(v) =>
              onChange((prev) => ({
                ...prev,
                billingAddress: { ...prev.billingAddress, postalCode: v },
              }))
            }
            required
            name="billingPostalCode"
          />
          <TextField
            label="Country"
            value={values.billingAddress.country}
            onChange={(v) =>
              onChange((prev) => ({
                ...prev,
                billingAddress: { ...prev.billingAddress, country: v },
              }))
            }
            required
            name="billingCountry"
          />
        </div>
      ) : null}

      <div className="flex items-center justify-end">
        <button
          type="submit"
          disabled={disabled}
          className={clsx(
            "inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm",
            disabled ? "opacity-60" : "hover:opacity-95",
            "focus:ring-2 ring-ring"
          )}
        >
          {disabled ? "Submitting..." : "Continue to delivery"}
        </button>
      </div>
    </form>
  );
}

export function Step2Form({
  values,
  onChange,
  onSubmit,
  disabled,
}: {
  values: Step2Values;
  onChange: (updater: (prev: Step2Values) => Step2Values) => void;
  onSubmit: () => Promise<void>;
  disabled: boolean;
}) {
  const options = [
    {
      id: "standard",
      title: "Standard delivery",
      description: "Delivery in 3-5 business days.",
      meta: "Free",
    },
    {
      id: "express",
      title: "Express delivery",
      description: "Delivery in 1-2 business days.",
      meta: "€9.90",
    },
  ];

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <RadioCards
        value={values.deliveryMethodId}
        onChange={(v) => onChange((prev) => ({ ...prev, deliveryMethodId: v }))}
        options={options}
      />

      <div className="flex items-center justify-end">
        <button
          type="submit"
          disabled={disabled}
          className={clsx(
            "inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm",
            disabled ? "opacity-60" : "hover:opacity-95",
            "focus:ring-2 ring-ring"
          )}
        >
          {disabled ? "Submitting..." : "Continue to payment"}
        </button>
      </div>
    </form>
  );
}

export function Step3Form({
  values,
  onChange,
  onSubmit,
  disabled,
}: {
  values: Step3Values;
  onChange: (updater: (prev: Step3Values) => Step3Values) => void;
  onSubmit: () => Promise<void>;
  disabled: boolean;
}) {
  const options = [
    {
      id: "card",
      title: "Credit card",
      description: "Visa, Mastercard, Amex.",
      meta: "Recommended",
    },
    {
      id: "paypal",
      title: "PayPal",
      description: "Pay using your PayPal account.",
      meta: "Fast",
    },
  ];

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <RadioCards
        value={values.paymentMethodId}
        onChange={(v) => onChange((prev) => ({ ...prev, paymentMethodId: v }))}
        options={options}
      />

      <div className="flex items-center justify-end">
        <button
          type="submit"
          disabled={disabled}
          className={clsx(
            "inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm",
            disabled ? "opacity-60" : "hover:opacity-95",
            "focus:ring-2 ring-ring"
          )}
        >
          {disabled ? "Submitting..." : "Pay now"}
        </button>
      </div>
    </form>
  );
}
