import { mime } from 'https://deno.land/x/mimetypes@v1.0.0/mod.ts';
import { faker } from "npm:@faker-js/faker@8.4.0";
import { Buffer } from 'node:buffer';

Deno.test("pdf file content type", () => {
    console.log(mime.getType("file.docx"));
});

Deno.test("sdsf", () => {
    console.log(Buffer.from(faker.image.avatarGitHub()).toString('base64'));
})