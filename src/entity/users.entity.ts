import { novo, ObjectId } from '@deps';

export type UserRole = "admin" | "user";

export function isValidRole(role: string): role is UserRole {
    return role === "admin" || role === "user";
}

interface User {

    _id: ObjectId;

    name: string;

    photoUrl?: string;

    domicile: string;

    age: number;

    email?: string;

    emailVerified: boolean;

    password?: string;

    role: UserRole;

    isVerified: boolean;

    formVerified: boolean;

    religion: string;

    status: string;

    lastEducation: string;

    work: string;

    church: string;

    phone: string;

    tribe: string;

    criteria: string;

    hope: string;

    withOAuth: boolean;

    oAuthProvider?: string;

    purchaseProof: string;

    uploadedFormUrl?: string;

    createdAt: string;

    updatedAt: string;

}

const UserModel = novo.model<User>("users");
export default UserModel;