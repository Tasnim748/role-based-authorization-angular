export interface News {
    _id: number;
    title: string;
    body: string;
}

export interface Role {
    _id: number;
    name: string;
    permissions: string[];
}

export interface User {
    _id: number;
    username: string;
    password: string;
    role: Role;
}