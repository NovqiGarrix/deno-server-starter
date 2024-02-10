import { novo } from "@deps";
import { ObjectId } from "@deps";

interface Verification {
    _id: ObjectId;
    email: string;
    // a JWT token to verify if the otp is still valid
    token: string;
    createdAt: string;
    updatedAt: string;
}

const VerificationModel = novo.model<Verification>("verifications");
export default VerificationModel;