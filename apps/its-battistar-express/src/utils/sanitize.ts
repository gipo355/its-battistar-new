import { isMongoId } from 'validator';
import blacklist from 'validator/lib/blacklist';
import escape from 'validator/lib/escape';
import isEmail from 'validator/lib/isEmail';
import normalizeEmail from 'validator/lib/normalizeEmail';
// import trim from 'validator/lib/trim';

// TODO: IMPROVE SANITIZATION
// use libs like DOMPurify or sanitize-html against XSS
// and use libs like express-mongo-sanitize against NoSQL Injection

/**
 * Sanitize class
 * chain the methods to sanitize the content
 */
export class Sanitize {
  constructor(
    private content: string,
    private error: Error | null = null
  ) {}

  get done(): {
    error: Error | null;
    string: string;
  } {
    return {
      string: this.content,
      error: this.error,
    };
  }

  get isValid(): boolean {
    return !this.error;
  }

  get errorMessage(): string {
    return this.error?.message ?? '';
  }

  forMongoInjection(): this {
    let sanitized = this.content.trim();

    sanitized = escape(sanitized);

    // blacklist chars with regex for possible mongo injection
    sanitized = blacklist(sanitized, '\\/<>$%^&*()=+{}[];:"\'');

    // sanitized = trim(sanitized);

    this.content = sanitized;

    return this;
  }

  isMongoId(): this {
    if (!this.content || !isMongoId(this.content)) {
      this.error = new Error('Not a valid Mongo ID');

      return this;
    }

    return this;
  }

  email(): this {
    let sanitizedEmail = this.content.trim().toLowerCase();

    const normalizedEmail = normalizeEmail(sanitizedEmail);

    if (!normalizedEmail) {
      this.error = new Error('Invalid email');

      return this;
    }

    sanitizedEmail = normalizedEmail;

    if (!sanitizedEmail) {
      this.error = new Error('Invalid email');

      return this;
    }

    if (!isEmail(sanitizedEmail)) {
      this.error = new Error('Invalid email');

      return this;
    }

    // TODO: IMPROVE SANITIZATION
    // blacklist chars with regex for possible mongo injection?
    // sanitizedEmail = blacklist(sanitizedEmail, '\\/<>$%^&*()=+{}[];:"\'');

    // sanitizedEmail = trim(sanitizedEmail);

    this.content = sanitizedEmail;

    return this;
  }

  password(): this {
    const sanitizedPassword = this.content.trim();

    // TODO: IMPROVE SANITIZATION
    // blacklist chars with regex for possible mongo injection
    // sanitizedPassword = blacklist(sanitizedPassword, '\\/<>$%^&*()=+{}[];:"\'');

    // sanitizedPassword = trim(sanitizedPassword);

    this.content = sanitizedPassword;

    return this;
  }

  forXSS(): this {
    const sanitized = escape(this.content.trim());

    // blacklist chars with regex for possible XSS
    // sanitized = blacklist(sanitized, '\\/<>$%^&*()=+{}[];:"\'');

    // sanitized = trim(sanitized);

    this.content = sanitized;

    return this;
  }
}

// export const sanitizeForMongoInjection = (content: string): string => {
//   let sanitized = content.trim();
//   sanitized = escape(sanitized);
//   // blacklist chars with regex for possible mongo injection
//   sanitized = blacklist(sanitized, '\\/<>$%^&*()=+{}[];:"\'');
//   sanitized = trim(sanitized);
//   return sanitized;
// };

// export const sanitizeEmail = (email: string): string | undefined => {
//   let sanitizedEmail = email.trim().toLowerCase();
//
//   const normalizedEmail = normalizeEmail(sanitizedEmail);
//
//   if (!normalizedEmail) {
//     return;
//   }
//
//   sanitizedEmail = normalizedEmail;
//
//   if (!sanitizedEmail) {
//     return;
//   }
//
//   if (!isEmail(sanitizedEmail)) {
//     return;
//   }
//   // blacklist chars with regex for possible mongo injection?
//   sanitizedEmail = blacklist(sanitizedEmail, '\\/<>$%^&*()=+{}[];:"\'');
//   sanitizedEmail = trim(sanitizedEmail);
//   return sanitizedEmail;
// };

// export const sanitizePassword = (password: string): string => {
//   let sanitizedPassword = password.trim();
//   // blacklist chars with regex for possible mongo injection
//   sanitizedPassword = blacklist(sanitizedPassword, '\\/<>$%^&*()=+{}[];:"\'');
//   sanitizedPassword = trim(sanitizedPassword);
//   return sanitizedPassword;
// };
//
// export const sanitizeForXSS = (content: string): string => {
//   let sanitized = escape(content);
//   sanitized = blacklist(sanitized, '\\/<>$%^&*()=+{}[];:"\'');
//   sanitized = trim(sanitized);
//   return sanitized;
// };

// let sanitizedEmail = email.trim().toLowerCase();
// sanitizedEmail = escape(sanitizedEmail);
// // blacklist chars with regex for possible mongo injection
// sanitizedEmail = blacklist(sanitizedEmail, '\\/<>$%^&*()=+{}[];:"\'');
// sanitizedEmail = trim(sanitizedEmail);
//
// let sanitizedPassword = password.trim();
// sanitizedPassword = escape(sanitizedPassword);
// // blacklist chars with regex for possible mongo injection
// sanitizedPassword = blacklist(sanitizedPassword, '\\/<>$%^&*()=+{}[];:"\'');
// sanitizedPassword = trim(sanitizedPassword);
