/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type {
    AbstractControl,
    ValidationErrors,
    ValidatorFn,
} from '@angular/forms';
import isURL from 'validator/lib/isURL';

/** A hero's name can't match the given regular expression */
export function inputIsUrl(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const isValid = isURL(control.value);

        return isValid
            ? null
            : {
                  invalidMongoId: {
                      value: control.value,
                  },
              };
    };
}
