
const [kind, ...base64] = Deno.args;

const inlineBase64 = base64.join("");

switch (kind) {
    case "--private":
        await Deno.writeTextFile('.env', `\nJWT_PRIVATE_KEY=${inlineBase64}`, { append: true })
        break;

    case "--public":
        await Deno.writeTextFile('.env', `\nJWT_PUBLIC_KEY=${inlineBase64}`, { append: true })
        break;

    default:
        console.error("Invalid kind");
}

console.log("Success");