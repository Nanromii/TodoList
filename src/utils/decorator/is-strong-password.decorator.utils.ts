import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
} from 'class-validator';

export function IsStrongPasswordDecorator(
    validationOptions?: ValidationOptions,
) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsStrongPasswordDecorator',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: any) {
                    if (typeof value !== 'string') return false;
                    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/.test(
                        value,
                    );
                },
                defaultMessage(args: ValidationArguments) {
                    const value = args.value;
                    if (typeof value !== 'string')
                        return 'Password must be a string.';
                    const errors: string[] = [];
                    if (!/[a-z]/.test(value))
                        errors.push('one lowercase letter');
                    if (!/[A-Z]/.test(value))
                        errors.push('one uppercase letter');
                    if (!/\d/.test(value)) errors.push('one digit');
                    if (!/[@$!%*?&]/.test(value))
                        errors.push('one special character (@$!%*?&)');
                    if (value.length < 6)
                        errors.push('at least 6 characters long');
                    return `Password must contain ${errors.join(', ')}.`;
                },
            },
        });
    };
}
