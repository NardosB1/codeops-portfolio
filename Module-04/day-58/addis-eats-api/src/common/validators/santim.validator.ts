import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsSantim(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isSantim',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          return typeof value === 'number' && Number.isInteger(value) && value >= 0;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a non-negative integer in Santim (100 Santim = 1 ETB).`;
        },
      },
    });
  };
}
