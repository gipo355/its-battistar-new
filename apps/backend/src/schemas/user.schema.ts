export interface IUser {
    firstName: string;
    fullName: string;
    id: string;
    lastName: string;
    picture: string;
}

export interface Credentials {
    password: string;
    username: string;
}

export type FullUser = IUser & Credentials;
