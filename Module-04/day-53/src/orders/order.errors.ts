export class OrderNotFoundError extends Error {
  constructor(public readonly id: number) {
    super(`Order #${id} was not found`);
    this.name = "OrderNotFoundError";
  }
}

export class PaymentDeclinedError extends Error {
  constructor(
    public readonly phone: string,
    public readonly reason: string,
  ) {
    super(`TeleBirr payment from ${phone} was declined: ${reason}`);
    this.name = "PaymentDeclinedError";
  }
}