import { Timestamp } from "firebase/firestore";

export interface Post {
    docID?: string;
    date: Timestamp;
    description: string;
    content: string;
}
