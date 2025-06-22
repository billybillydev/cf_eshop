export class IdObject {
  constructor(private readonly id: number) {}

  equals(id: IdObject): boolean {
    return this.id === id.value();
  }

  value(): number {
    return this.id;
  }
}