import env from "@config/env.ts";
import logger from '@utils/logger.ts';
import { ServiceException } from "@exceptions/serviceException.ts";

export interface User {
    name: string;
    email: string;
}

export interface IMessage {
    to: Array<User>;
    sender: User;
    htmlContent: string;
    subject: string;
}

export default async function sendEmail(options: Omit<IMessage, "sender">) {
    try {

        const SENDIN_BLUE_URL = "https://api.sendinblue.com/v3/smtp/email";
        const mailOptions: IMessage = {
            sender: {
                name: "MentorTemanHidup",
                email: "no-reply@mentortemanhidup.com"
            }, ...options
        }

        const requestHeaders = {
            "Content-Type": "application/json",
            "api-key": env.SENDINBLUE_API_KEY,
        }
        const res = await fetch(SENDIN_BLUE_URL, {
            headers: requestHeaders,
            method: "POST",
            body: JSON.stringify(mailOptions)
        });

        const data = await res.json();

        if (data?.message) {
            throw ServiceException.internalServerError();
        }

        for (const user of mailOptions.to) {
            logger.success(`🔥 EMAIL SENT TO ${user.email} 🎯`);
        }

        return "OK";

    } catch (error) {
        if (error instanceof ServiceException) {
            throw error;
        }

        logger.error(`Error while sending email: ${error.message}. Data: ${JSON.stringify(error, null, 2)}`);
        throw ServiceException.internalServerError();
    }
}