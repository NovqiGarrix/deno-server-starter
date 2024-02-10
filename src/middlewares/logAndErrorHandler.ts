// deno-lint-ignore-file no-explicit-any
import { Context, red, isHttpError, yellow, green } from "@deps";
import logger from "@utils/logger.ts";
import { ServiceException } from "@exceptions/serviceException.ts";

export default async function logAndErrorHandler(
  { request, response }: Context<Record<string, any>, Record<string, any>>,
  next: () => Promise<unknown>,
) {
  const startTime = Date.now();

  try {
    if (request.url.pathname === "/favicon.ico") {
      return await next();
    }

    logger.info(
      `${yellow('REQUEST')} => [METHOD]: "${request.method}" [ENDPOINT]: "${request.url.pathname}"`,
    );

    await next();

    const endTime = Date.now();
    const time = endTime - startTime;

    logger.success(
      `${green('RESPONSE')} => [TOOK]: ${time}ms [METHOD]: "${request.method}" [CODE]: "${response.status}" [ENDPOINT]: "${request.url.pathname}"`,
    );
  } catch (error) {
    if (isHttpError(error)) {
      response = ServiceException.internalServerError().toResponse(response);
    } else if (error instanceof ServiceException) {
      response = error.toResponse(response);
    } else {
      response = ServiceException.internalServerError().toResponse(response);
    }

    const endTime = Date.now();
    const time = endTime - startTime;
    logger.info(
      red(
        `${green('REQUEST')} => [TOOK]: ${time}ms [METHOD]: "${request.method}" [STATUS]: "${response.status}" [ENDPOINT]: "${request.url.pathname}"`,
      ),
    );
  }
}
