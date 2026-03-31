import { useMemo, useState } from "react";

export type StepStatus = "passed" | "pending" | "waiting";

export type Checkout = {
  step1: StepStatus;
  step2: StepStatus;
  step3: StepStatus;
};

export type BuyerInformation = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type AddressValues = {
  line1: string;
  line2: string;
  city: string;
  postalCode: string;
  country: string;
};

export type Step1Values = {
  buyer: BuyerInformation;
  shippingAddress: AddressValues;
  billingAddress: AddressValues;
  billingSameAsShipping: boolean;
};

export type Step2Values = {
  deliveryMethodId: string;
};

export type Step3Values = {
  paymentMethodId: string;
};

type CheckoutStepApiResponse =
  | { success: true; checkout: Checkout }
  | { success: false; error: string };

function isStepStatus(value: unknown): value is StepStatus {
  return value === "passed" || value === "pending" || value === "waiting";
}

function isCheckout(value: unknown): value is Checkout {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    isStepStatus(v.step1) &&
    isStepStatus(v.step2) &&
    isStepStatus(v.step3)
  );
}

function getActiveStepFromCheckout(checkout: Checkout): 1 | 2 | 3 {
  if (checkout.step1 !== "passed") return 1;
  if (checkout.step2 !== "passed") return 2;
  return 3;
}

function fallbackCheckoutAfterStep(step: 1 | 2 | 3): Checkout {
  if (step === 1) {
    return { step1: "passed", step2: "pending", step3: "waiting" };
  }
  if (step === 2) {
    return { step1: "passed", step2: "passed", step3: "pending" };
  }
  return { step1: "passed", step2: "passed", step3: "passed" };
}

async function postCheckoutStep<TPayload>(
  step: 1 | 2 | 3,
  payload: TPayload
): Promise<CheckoutStepApiResponse> {
  try {
    const res = await fetch(`/api/checkout/step${step}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await res.json().catch(() => null)) as unknown;

    if (!res.ok) {
      const maybeError = (data as { error?: unknown } | null)?.error;
      return {
        success: false,
        error: typeof maybeError === "string" ? maybeError : "Request failed",
      };
    }

    const maybeCheckout = (data as { checkout?: unknown } | null)?.checkout;
    if (isCheckout(maybeCheckout)) {
      return { success: true, checkout: maybeCheckout };
    }

    return { success: true, checkout: fallbackCheckoutAfterStep(step) };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Network error",
    };
  }
}

const emptyAddress: AddressValues = {
  line1: "",
  line2: "",
  city: "",
  postalCode: "",
  country: "",
};

export function useCheckoutFlow(): {
  checkout: Checkout;
  activeStep: 1 | 2 | 3;
  isSubmitting: boolean;
  error: string | null;
  step1: Step1Values;
  setStep1: (updater: (prev: Step1Values) => Step1Values) => void;
  step2: Step2Values;
  setStep2: (updater: (prev: Step2Values) => Step2Values) => void;
  step3: Step3Values;
  setStep3: (updater: (prev: Step3Values) => Step3Values) => void;
  submitStep1: () => Promise<void>;
  submitStep2: () => Promise<void>;
  submitStep3: () => Promise<void>;
  canOpenStep: (step: 1 | 2 | 3) => boolean;
  openStep: (step: 1 | 2 | 3) => void;
} {
  const [checkout, setCheckout] = useState<Checkout>({
    step1: "pending",
    step2: "waiting",
    step3: "waiting",
  });

  const [openedStep, setOpenedStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [step1, setStep1State] = useState<Step1Values>({
    buyer: { firstName: "", lastName: "", email: "", phone: "" },
    shippingAddress: { ...emptyAddress },
    billingAddress: { ...emptyAddress },
    billingSameAsShipping: true,
  });

  const [step2, setStep2State] = useState<Step2Values>({
    deliveryMethodId: "standard",
  });

  const [step3, setStep3State] = useState<Step3Values>({
    paymentMethodId: "card",
  });

  const activeStep = useMemo(() => {
    const derived = getActiveStepFromCheckout(checkout);
    if (openedStep < derived) return openedStep;
    return derived;
  }, [checkout, openedStep]);

  function canOpenStep(step: 1 | 2 | 3) {
    const derived = getActiveStepFromCheckout(checkout);
    return step <= derived;
  }

  function openStep(step: 1 | 2 | 3) {
    if (canOpenStep(step)) setOpenedStep(step);
  }

  function setStep1(updater: (prev: Step1Values) => Step1Values) {
    setStep1State(updater);
  }

  function setStep2(updater: (prev: Step2Values) => Step2Values) {
    setStep2State(updater);
  }

  function setStep3(updater: (prev: Step3Values) => Step3Values) {
    setStep3State(updater);
  }

  async function submitStep(step: 1 | 2 | 3) {
    setIsSubmitting(true);
    setError(null);

    const payload =
      step === 1
        ? {
            ...step1,
            billingAddress: step1.billingSameAsShipping
              ? step1.shippingAddress
              : step1.billingAddress,
          }
        : step === 2
          ? step2
          : step3;

    const res = await postCheckoutStep(step, payload);

    if (!res.success) {
      setError(res.error);
      setIsSubmitting(false);
      return;
    }

    setCheckout(res.checkout);
    setOpenedStep(getActiveStepFromCheckout(res.checkout));
    setIsSubmitting(false);
  }

  async function submitStep1() {
    await submitStep(1);
  }

  async function submitStep2() {
    await submitStep(2);
  }

  async function submitStep3() {
    await submitStep(3);
  }

  return {
    checkout,
    activeStep,
    isSubmitting,
    error,
    step1,
    setStep1,
    step2,
    setStep2,
    step3,
    setStep3,
    submitStep1,
    submitStep2,
    submitStep3,
    canOpenStep,
    openStep,
  };
}
