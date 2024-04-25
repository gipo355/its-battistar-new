export type ValueOf<T> = T[keyof T];

// export type Values = typeof myObj[keyof typeof myObj];

export type StringValueOf<T> = T[keyof T] & string;

// export type Another = Required<T>[keyof T]
