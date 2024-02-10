import env from "@config/env.ts";
import { ObjectId, Status, argon2 } from "@deps";
import logger from "@utils/logger.ts";
import sendEmailFunc from '@utils/sendEmail.ts';
import { ServiceException } from "@exceptions/serviceException.ts";
import UserModel from "@entity/users.entity.ts";
import VerificantionModel from "@entity/verifications.entity.ts";
import jwt from "@utils/jwt.ts";
import { RegisterRequestSchema } from "@models/web/signup.model.ts";
import { handleError } from "./utils.ts";
import { VerifyEmailOtpRequestSchema } from "@models/web/signup.model.ts";
import { LoginRequestSchema } from "@models/web/signin.model.ts";

interface GenAccessTokenParams {
    id: string | ObjectId;
    role: string;
    name: string;
    photoUrl?: string;
}

function genAccessToken({ id, name, role, photoUrl }: GenAccessTokenParams): Promise<string> {
    return jwt.signJwt({
        role,
        name,
        sub: id.toString(),
        aud: `MentorTemanHidup_id`,
        photoUrl: photoUrl ?? null
    }, "1d");
}

export async function handleGithubCallback(code: string): Promise<string> {

    try {

        const resp = await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                code,
                client_id: env.GITHUB_CLIENT_ID,
                client_secret: env.GITHUB_CLIENT_SECRET,
                redirect_uri: env.GITHUB_REDIRECT_URI
            })
        });

        if (resp.status !== Status.OK) {
            logger.error(`Error while fetching github access token: ${(await ServiceException.fromHttpResponse(resp)).stringify()}`);
            throw new ServiceException()
                .setCode(Status.InternalServerError)
                .setStatus("Internal Server Error")
                .setCommonError("Something went wrong!");
        }

        const { access_token } = await resp.json();

        // Get user details
        const userResp = await fetch("https://api.github.com/user", {
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        });

        if (resp.status !== Status.OK) {
            logger.error(`Error while fetching github access token: ${(await ServiceException.fromHttpResponse(userResp)).stringify()}`);
            throw new ServiceException()
                .setCode(Status.InternalServerError)
                .setStatus("Internal Server Error")
                .setCommonError("Something went wrong!");
        }

        const { name, email, avatar_url } = await userResp.json();

        // Check if the user is already registered
        const existingUser = await UserModel.findOne({ email });

        let redirectUrl: URL;

        if (existingUser) {
            redirectUrl = new URL('mentortemanhidup://login');
            // TODO: How to make sure the client knows that this request comes from the server?
            // for security reasons

            // Sign a JWT here
            const token = await genAccessToken({
                id: existingUser._id,
                name: existingUser.name,
                role: existingUser.role,
                photoUrl: existingUser.photoUrl
            });

            redirectUrl.searchParams.append("token", token);
        } else {
            redirectUrl = new URL('mentortemanhidup:///register');
            redirectUrl.searchParams.append("name", name);
            redirectUrl.searchParams.append('oAuthProvider', 'Github');
            redirectUrl.searchParams.append("photo_url", avatar_url);
            if (email) {
                redirectUrl.searchParams.append("email", email);
            }
        }

        return redirectUrl.toString();

    } catch (error) {
        throw handleError(error);
    }

}

export function generateOtp(): string {
    // Generate 6 digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function getEmailVerificationTemplate(otp: string, name: string): Promise<string> {

    try {

        const resp = await fetch('https://mentortemanhidup.s3.ap-southeast-2.amazonaws.com/public/email_templates/sicantikbangsa_otp.html');

        if (!resp.ok) {
            throw ServiceException.fromHttpResponse(resp);
        }

        const text = await resp.text();

        const template = text.replace("{{year}}", new Date().getFullYear().toString())
            .replace("{{code_otp}}", otp)
            .replace("{{user_name}}", name);

        return template;

    } catch (error) {
        throw handleError(error, 'getEmailVerificationTemplate');
    }

}

export async function signup(data: RegisterRequestSchema) {

    if (data.withOAuth && !data.oAuthProvider) {
        throw new ServiceException()
            .setCode(Status.BadRequest)
            .setStatus("Bad Request")
            .setCommonError("oAuthProvider is required if sign up with OAuth!");
    }

    try {

        const user = await UserModel.findOne({ email: data.email });

        if (user) {
            throw new ServiceException()
                .setCode(Status.BadRequest)
                .setStatus("Bad Request")
                .setCommonError("Pengguna dengan email ini sudah terdaftar!");
        }

        await UserModel.create({
            ...data,
            formVerified: false,
            isVerified: false,
            lastEducation: data.education,
            role: "user",
            phone: data.noWa,
            work: data.job,
            emailVerified: !!data.oAuthHasEmail,
            ...(data.password ? { password: await argon2.hash(data.password) } : {})
        });

        // Send email
        if (!data.withOAuth || !data.oAuthHasEmail) {
            const otp = generateOtp();
            const token = await jwt.signJwt({ otp }, "10m");

            await VerificantionModel.upsert({ email: data.email }, {
                token,
                email: data.email,
            });

            await sendEmailFunc({
                to: [{ name: data.name, email: data.email }],
                subject: "Kode Verifikasi MentorTemanHidup",
                htmlContent: await getEmailVerificationTemplate(otp, data.name)
            });
        }

    } catch (error) {
        throw handleError(error);
    }

}

export async function verifyEmailOtp(payload: VerifyEmailOtpRequestSchema) {

    const { email, otp } = payload;

    try {

        // Get verification data from DB
        const verification = await VerificantionModel.findOne({ email });

        if (!verification) {
            throw new ServiceException()
                .setCode(Status.BadRequest)
                .setStatus("Bad Request")
                .setCommonError("Anda belum mendaftarkan di aplikasi Mentor Teman Hidup!");
        }

        // Verify token
        const { otp: oriOtp } = await jwt.verify<{ otp: string }>(verification.token);

        if (oriOtp !== otp) {
            throw new ServiceException()
                .setCode(Status.BadRequest)
                .setStatus("Bad Request")
                .setCommonError("Kode OTP yang Anda masukkan salah!");
        }

        await Promise.race([
            UserModel.updateOne({ email }, { emailVerified: true }),
            VerificantionModel.deleteOne({ _id: verification._id })
        ]);

    } catch (error) {
        throw handleError(error, 'verifyEmailOtp');
    }

}

export async function signin(data: LoginRequestSchema) {

    const { email, password } = data;

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            throw new ServiceException()
                .setCode(Status.BadRequest)
                .setStatus("Bad Request")
                .setCommonError("Email atau password Anda salah!");
        }

        if (user.withOAuth) {
            throw new ServiceException()
                .setCode(Status.BadRequest)
                .setStatus("Bad Request")
                .setCommonError(`Akun Anda terdaftar dengan ${user.oAuthProvider}, silahkan login dengan akun ${user.oAuthProvider} Anda!`);
        }

        if (!user.emailVerified) {
            throw new ServiceException()
                .setCode(Status.BadRequest)
                .setStatus("Bad Request")
                .setCommonError("Email Anda belum terverifikasi!");
        }

        const isPasswordValid = await argon2.verify(user.password!, password);

        if (!isPasswordValid) {
            throw new ServiceException()
                .setCode(Status.BadRequest)
                .setStatus("Bad Request")
                .setCommonError("Email atau password Anda salah!");
        }

        const token = await genAccessToken({
            id: user._id,
            name: user.name,
            role: user.role,
            photoUrl: user.photoUrl
        });

        return {
            user: {
                aud: user._id,
                name: user.name,
                photoUrl: user.photoUrl,
                role: user.role
            },
            token
        }
    } catch (error) {
        throw handleError(error, 'signin');
    }

}