export class EmailObject {
    constructor(private readonly value: string) {}

    equals(email: EmailObject): boolean {
        return this.value === email.value;
    }

    toString(): string {
        return this.value;
    }

    isValid(): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(this.value);
    }
}