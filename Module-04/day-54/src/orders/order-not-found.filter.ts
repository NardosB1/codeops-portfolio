import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import type { Response } from "express";
import { OrderNotFoundError } from "./order.errors.js";

// Turns the domain error from Day 53 into a 404 without touching the service.
@Catch(OrderNotFoundError)
export class OrderNotFoundFilter implements ExceptionFilter<OrderNotFoundError> {
  catch(exception: OrderNotFoundError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    response.status(HttpStatus.NOT_FOUND).json({
      statusCode: HttpStatus.NOT_FOUND,
      error: "Not Found",
      message: exception.message,
    });
  }
}