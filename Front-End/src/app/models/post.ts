import { Timestamp } from "firebase/firestore";

export interface Post {
    docID?: number;
    date: Timestamp;
    description: string;
    content: string;
}
