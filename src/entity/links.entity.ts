import { novo } from "@deps";
import { ObjectId } from "@deps";

interface Link {
    _id: ObjectId;
    src: string;
}

const LinkModel = novo.model<Link>("links");
export default LinkModel;