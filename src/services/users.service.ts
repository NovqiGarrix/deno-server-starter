import { Status } from "@deps";
import UserModel from '@entity/users.entity.ts';
import { ServiceException } from "@exceptions/serviceException.ts";
import { UploadUserFormFileRequestSchema } from "@models/web/uploadUserFormFile.ts";
import { uploadFile } from "@services/files.service.ts";
import { handleError } from "@services/utils.ts";
import objectIdConvertion from "@utils/objectIdConvertion.ts";

export async function uploadUserFormFile(userId: string, data: UploadUserFormFileRequestSchema) {

    try {

        const user = await UserModel.findOne({ _id: objectIdConvertion.toObjectId(userId) });

        if (!user) {
            throw new ServiceException()
                .setCode(Status.BadRequest)
                .setStatus("Bad Request")
                .setCommonError(`User with id ${userId} does not exist!`);
        }

        const uploadedUrl = await uploadFile({
            base64: data.base64,
            contentType: data.contentType,
            filepath: `form_data_diri_lengkap/${user.name.replaceAll(" ", "_")}-${crypto.randomUUID()}`
        });

        await UserModel.updateOne({ _id: objectIdConvertion.toObjectId(userId) }, { uploadedFormUrl: uploadedUrl });

    } catch (error) {
        throw handleError(error);
    }

}