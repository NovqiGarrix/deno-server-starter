
import { Buffer } from 'node:buffer';

export default function isBase64(str: string) {
    try {
        Buffer.from(str, "base64");
        return true
    } catch (_e) {
        return false;
    }
}