import s3 from '@lib/s3.ts';
import { UploadFileParams } from "@models/web/uploadFile.model.ts";

export function uploadFile(params: UploadFileParams) {
    return s3.uploadFile(params);
}