import { s3 } from '@deps';
import { Buffer } from 'node:buffer';
import env from '@config/env.ts';
import { ServiceException } from "@exceptions/serviceException.ts";
import { Status } from "@deps";
import logger from "@utils/logger.ts";

/**
 * @param base64 - base64 encoded file
 * @param filepath - file path in s3 including the filename and extension
 * @param contentType - content type of the file
 */
interface UploadFileParams {
    base64: string;
    filepath: string;
    contentType: string;
}

const client = new s3.S3Client({
    region: "ap-southeast-2",
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY
    }
});

async function uploadFile(params: UploadFileParams) {
    const { base64, filepath, contentType } = params;

    const command = new s3.PutObjectCommand({
        Bucket: "mentortemanhidup",
        Key: filepath,
        Body: Buffer.from(base64, 'base64'),
        ContentEncoding: 'base64',
        ContentType: contentType,
    });

    try {
        await client.send(command);
        return `https://mentortemanhidup.s3.ap-southeast-2.amazonaws.com/${filepath}`;
    } catch (err) {
        logger.error(`Error while uploading file to s3: ${JSON.stringify(err, null, 2)}`);
        throw new ServiceException()
            .setCode(Status.InternalServerError)
            .setStatus("Internal Server Error")
            .setCommonError("Failed to upload your file!");
    }
}

export default {
    uploadFile
}