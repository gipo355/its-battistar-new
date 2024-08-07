/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type {
    AbstractControl,
    ValidationErrors,
    ValidatorFn,
} from '@angular/forms';
import { isAscii } from 'validator';

/** A hero's name can't match the given regular expression */
export function inputIsASCII(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const isValid = isAscii(control.value);

        return isValid
            ? null
            : {
                  invalidMongoId: {
                      value: control.value,
                  },
              };
    };
}
