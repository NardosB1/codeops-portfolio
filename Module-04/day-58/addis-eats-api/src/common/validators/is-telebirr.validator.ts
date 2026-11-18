import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsTeleBirrNumber(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isTeleBirrNumber',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          const telebirrRegex = /^(?:\+251|0)[97]\d{8}$/;
          return typeof value === 'string' && telebirrRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid Ethiopian Telebirr number (e.g., 0911234567, 0711234567, or +251911234567).`;
        },
      },
    });
  };
}
