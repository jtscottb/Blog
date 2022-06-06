import { Timestamp } from "firebase/firestore";

export interface Post {
    docID?: string;
    date: Timestamp;
    group: string;
    description: string;
    content: string;
}
