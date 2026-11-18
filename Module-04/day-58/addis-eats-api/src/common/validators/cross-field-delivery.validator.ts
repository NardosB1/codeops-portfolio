import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/**
 * Cross-field rule attached to `deliveryAddress`:
 * If `deliveryType` is 'DELIVERY', `deliveryAddress` must be a non-empty string of at least 5 characters.
 * Attached to `deliveryAddress` because it is the dependent field that the customer must fill out or fix.
 */
export function IsAddressRequiredForDelivery(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isAddressRequiredForDelivery',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const obj = args.object as { deliveryType?: string };
          if (obj.deliveryType === 'DELIVERY') {
            return typeof value === 'string' && value.trim().length >= 5;
          }
          return true;
        },
        defaultMessage() {
          return 'deliveryAddress is required (minimum 5 characters) when deliveryType is DELIVERY.';
        },
      },
    });
  };
}
