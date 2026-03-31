export class PasswordObject {
  private storedHash: string = "";
  private readonly defaultSaltHex: string = "54c529bc5a076460afe5facf63097922";

  constructor(hash?: string, salt?: string) {
    if (hash) {
      this.storedHash = hash;
    }
    if (salt) {
      this.defaultSaltHex = salt;
    }
  }

  async hash(
    value: string,
    providedSaltHex?: string
  ): Promise<PasswordObject> {
    // Use provided salt if available, otherwise generate a new one
    const saltHex = providedSaltHex || this.defaultSaltHex;
    const salt = this.fromStringToUint8Array(saltHex);
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(value),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );
    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
    const exportedKey = (await crypto.subtle.exportKey(
      "raw",
      key
    )) as ArrayBuffer;
    const hashBuffer = new Uint8Array(exportedKey);
    const hashArray = Array.from(hashBuffer);
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    this.storedHash = `${saltHex}:${hashHex}`;

    return this;
  }

  async verify(passwordAttempt: string): Promise<boolean> {
    const [saltHex, originalHash] = this.storedHash.split(":");
    const attemptHashWithSalt = await this.hash(passwordAttempt, saltHex);
    const [, attemptHash] = attemptHashWithSalt.toString().split(":");
    return attemptHash === originalHash;
  }

  toString(): string {
    return this.storedHash;
  }

  private fromStringToUint8Array(value: string) {
    const matchResult = value.match(/.{1,2}/g);
    if (!matchResult) {
      throw new Error("Invalid salt format");
    }
    return new Uint8Array(matchResult.map((byte) => parseInt(byte, 16)));
  }
}
