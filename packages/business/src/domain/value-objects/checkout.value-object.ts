export type CheckoutStepValue = 0 | 1 | 2;

/**
 * Represents the status of a checkout step.
 * - 0: waiting (step not yet accessible)
 * - 1: pending (step is currently active)
 * - 2: passed (step has been completed)
 *
 * @example
 * const checkout = new CheckoutValueObject(1, 0, 0); // Step 1 pending, steps 2 & 3 waiting
 * checkout.validateStep(); // Step 1 passed, step 2 pending
 * checkout.getStepStatus(1); // Returns 2 (passed)
 * checkout.getStepStatus(2); // Returns 1 (pending)
 */

export class CheckoutValueObject {
  readonly #steps: CheckoutStepValue[];
  #currentStep = 1;

  constructor(...steps: CheckoutStepValue[]) {
    const normalizedSteps: CheckoutStepValue[] = steps.length ? [...steps] : [0];

    for (let i = 0; i < normalizedSteps.length; i += 1) {
      const step = normalizedSteps[i];
      if (step !== 0 && step !== 1 && step !== 2) {
        throw new Error("Invalid step value");
      }

      if (i > 0 && step === 2 && normalizedSteps[i - 1] !== 2) {
        throw new Error("A step cannot be passed if the previous step is not passed");
      }
    }

    this.#steps = normalizedSteps;
  }

  validateStep(): void {
    if (this.#currentStep !== 1) {
      return;
    }

    if (this.#steps.length < 2) {
      throw new Error("Cannot validate step when steps length is less than 2");
    }

    this.#currentStep += 1;

    this.#steps[this.#currentStep - 1] = 1;
    this.#steps[this.#currentStep - 2] = 2;
  }

  getStepStatus(currentStep: number): CheckoutStepValue {
    if (currentStep < 1 || currentStep > this.#steps.length) {
      throw new Error("Step out of range");
    }
    return this.#steps[currentStep - 1];
  }

  get steps(): ReadonlyArray<CheckoutStepValue> {
    return this.#steps.slice();
  }

  get currentStep(): number {
    return this.#currentStep;
  }
}
