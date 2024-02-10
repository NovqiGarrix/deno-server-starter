import { OakRequest } from '@deps';
import { ServiceException } from "@exceptions/serviceException.ts";

export default function parseBody(req: OakRequest) {

    if (req.body.type() !== "json") {
        throw new ServiceException()
            .setCode(400)
            .setStatus("Bad Request")
            .setCommonError("Request body is required");
    }

    return req.body.json();

}