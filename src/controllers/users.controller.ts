import { Status } from "@deps";
import { OakContext } from "@types";
import catchHandler from "@utils/catchHandler.ts";
import { uploadUserFormFileSchema } from "@models/web/uploadUserFormFile.ts";
import { uploadUserFormFile } from '@services/users.service.ts';
import { ResponseBody } from "@models/response.model.ts";
import parseBody from "@utils/parseBody.ts";

export async function uploadUserFormFileHandler(ctx: OakContext<"/full_form">) {

    try {

        const reqBody = uploadUserFormFileSchema.parse(await parseBody(ctx.request));
        await uploadUserFormFile(ctx.state.user._id, reqBody);

        ctx.response = new ResponseBody()
            .setCode(Status.OK)
            .setStatus("OK")
            .toResponse(ctx.response);

    } catch (error) {
        catchHandler(ctx.response, error);
    }

}