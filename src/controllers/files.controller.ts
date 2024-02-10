import { Status } from "@deps";
import { OakContext } from "@types";
import { uploadFileParamsSchema } from "@models/web/uploadFile.model.ts";
import catchHandler from "@utils/catchHandler.ts";
import { uploadFile } from '@services/files.service.ts';
import { ResponseBody } from "@models/response.model.ts";

export async function uploadFileHandler(ctx: OakContext<"/">) {

    try {

        const reqBody = uploadFileParamsSchema.parse(await ctx.request.body.json());

        const uploadedUrl = await uploadFile(reqBody);

        ctx.response = new ResponseBody()
            .setCode(Status.OK)
            .setStatus("OK")
            .setData({ url: uploadedUrl })
            .toResponse(ctx.response);

    } catch (error) {
        catchHandler(ctx.response, error);
    }

}