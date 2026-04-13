import {
  CheckoutPageLayout,
  CheckoutStepper,
  ErrorBanner,
  Step1Form,
  Step2Form,
  Step3Form,
  StepCard,
} from "$/pages/checkout/components";
import { useCheckoutFlow } from "$/pages/checkout/hooks";

export function CheckoutPage() {
  const {
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
  } = useCheckoutFlow();

  return (
    <CheckoutPageLayout>
      <div className="space-y-8">
        <section className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Checkout
          </h1>
          <p className="text-sm text-muted-foreground">
            Complete the steps below to place your order.
          </p>
        </section>

        <CheckoutStepper
          checkout={checkout}
          activeStep={activeStep}
          canOpenStep={canOpenStep}
          openStep={openStep}
        />

        {error ? <ErrorBanner message={error} /> : null}

        {activeStep === 1 ? (
          <StepCard
            title="Step 1 — Buyer information & addresses"
            description="Your contact information, shipping address and billing address."
          >
            <Step1Form
              values={step1}
              onChange={setStep1}
              onSubmit={submitStep1}
              disabled={isSubmitting}
            />
          </StepCard>
        ) : null}

        {activeStep === 2 ? (
          <StepCard
            title="Step 2 — Delivery method"
            description="Choose how you want your order delivered."
          >
            <Step2Form
              values={step2}
              onChange={setStep2}
              onSubmit={submitStep2}
              disabled={isSubmitting}
            />
          </StepCard>
        ) : null}

        {activeStep === 3 ? (
          <StepCard
            title="Step 3 — Payment"
            description="Select a payment method and confirm."
          >
            <Step3Form
              values={step3}
              onChange={setStep3}
              onSubmit={submitStep3}
              disabled={isSubmitting}
            />
          </StepCard>
        ) : null}
      </div>
    </CheckoutPageLayout>
  );
}
