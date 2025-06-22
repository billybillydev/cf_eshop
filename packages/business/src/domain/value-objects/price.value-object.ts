export type Currency = "EUR" | "USD" | "GBP";

export class PriceObject {
  private readonly amount: number;
  private readonly currency: Currency = "USD";
  private readonly locale = "en-US";

  constructor(amount: number, currency?: Currency) {
    if (amount < 0) {
      throw new Error("Amount cannot be negative");
    }
    this.amount = amount;
    if (currency) {
      this.currency = currency;
    }
  }

  // Méthode pour comparer deux instances de Price
  equals(other: PriceObject): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  // Méthode pour obtenir une représentation sous forme de chaîne
  toString(): string {
    return new Intl.NumberFormat(this.locale, {
        currency: this.currency,
        style: "currency",
    }).format(this.amount);
  }

  // Méthode pour additionner deux prix (doit être de la même devise)
  add(other: PriceObject): PriceObject {
    if (this.currency !== other.currency) {
      throw new Error("Cannot add prices with different currencies");
    }
    return new PriceObject(this.amount + other.amount, this.currency);
  }

  // Méthode pour obtenir la valeur du prix
  getValue(): number {
    return this.amount;
  }

  // Méthode pour obtenir la devise
  getCurrency(): Currency {
    return this.currency;
  }
}