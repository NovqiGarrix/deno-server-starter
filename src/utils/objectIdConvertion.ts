import { ObjectId } from "@deps";

function toString(id: string | ObjectId): string {
    if (typeof id === "string") return id;

    return id.toString();
}

function toObjectId(id: string | ObjectId): ObjectId {
    if (typeof id === "string") return new ObjectId(id);

    return id;
}

export default {
    toString,
    toObjectId,
};
