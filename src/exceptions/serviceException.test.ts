import { assertEquals } from "@testDeps";
import { ServiceException } from "@exceptions/serviceException.ts";

Deno.test("Should return for validation errors", () => {

    const e = new ServiceException()
        .setCode(400)
        .setStatus("Bad Request")
        .setValidationErrors([
            { field: "username", message: "Username is required" },
            { field: "password", message: "Password is required" }
        ]);

    // deno-lint-ignore no-explicit-any
    assertEquals(e.toResponse({} as any).body, {
        code: 400,
        status: "Bad Request",
        errors: [
            { field: "username", message: "Username is required" },
            { field: "password", message: "Password is required" }
        ]
    });

});

Deno.test("Should return internal server error", () => {

    const e = ServiceException.internalServerError();

    // deno-lint-ignore no-explicit-any
    assertEquals(e.toResponse({} as any).body, {
        code: 500,
        status: "InternalServerError",
        errors: [{ error: "Something went wrong" }]
    });

})