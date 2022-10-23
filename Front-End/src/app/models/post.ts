import { Timestamp } from "firebase/firestore";

export interface Post {
    docID?: string;
    title: string;
    date: Timestamp;
    group: string;
    description: string;
    content: string;
}
