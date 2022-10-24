import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Firestore } from '@angular/fire/firestore';
import { Meta } from '@angular/platform-browser';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, QueryDocumentSnapshot, QuerySnapshot, DocumentSnapshot, Timestamp, query, collectionGroup, where, orderBy, limit } from 'firebase/firestore';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  app: FirebaseApp = initializeApp(environment.firebase);
  db: Firestore = getFirestore(this.app);
  url: string = 'https://firestore.googleapis.com/v1/projects/adventuring-with-the-banks/databases/(default)/documents/';
  
  public categories = [
    {type: 'journal', title: 'Daily Dose'},
    {type: 'finance', title: 'Common Cents'},
    {type: 'hair', title: 'Hair, There, Everywhere'},
    {type: 'cleaning', title: 'Tidy Talk'},
    {type: 'travel', title: 'Pack Your Bags'},
    {type: 'fashion', title: 'Classy Threads'},
    {type: 'cooking', title: 'Herbs and Lemons'},
    {type: 'home', title: 'A Beautiful Mess'},
    {type: 'beauty', title: 'Almost Bare'}
  ]
  private latestPosts: Post[] = [];

  constructor(private meta: Meta) {
  }

  async getPosts(blog: string): Promise<Post[]> {
    const DOCS: Post[] = [];
    await getDocs(collection(this.db, blog)).then( (documents: QuerySnapshot) => {
      documents.forEach( (doc: QueryDocumentSnapshot) => {
        var post: Post = {
          docID: doc.id,
          date: doc.get('date'),
          group: doc.get('group'),
          title: doc.get('title'),
          description: doc.get('description'),
          content: doc.get('content')
        }
        DOCS.push(post);
      });
    });
    return DOCS;
  }

  async getPost(blog: string, docID: string): Promise<Post> {
    var post: Post = {
      docID: 'id',
      date: new Timestamp(new Date().getTime()/1000, new Date().getMilliseconds()),
      group: 'group',
      title: 'title',
      description: 'description',
      content: 'content'
    };
    await getDoc(doc(this.db, '/'+blog+'/'+docID)).then( (doc: DocumentSnapshot) => {
      post.docID = doc.id;
      post.date = doc.get('date');
      post.group = doc.get('group');
      post.title = doc.get('title');
      post.description = doc.get('description');
      post.content = doc.get('content');
    });
    return post;
  }

  createPost(blog: string, Post: Post) {
    return addDoc(collection(this.db, blog), Post);
  }

  updatePost(blog: string, Post: Post) {
    return setDoc(doc(this.db, '/'+blog+'/'+Post.docID), Post);
  }

  deletePost(blog: string, Post: Post) {
    return deleteDoc(doc(this.db, '/'+blog+'/'+Post.docID));
  }

  async randomPost(blog: string): Promise<Post> {
    const type: string = this.categories[Math.floor(Math.random()*this.categories.length)].type;
    const DOCS: Post[] = await this.getPosts(blog);
    let randPost: Post = DOCS[Math.floor(Math.random()*DOCS.length)];

    return randPost;
  }

  getLatestPosts(): Observable<Post[]> {
    this.latestPosts = [];
    for(let cat of this.categories) {
      this.getPosts(cat.type).then( (posts: Post[]) => {
        var latestPost: Post = {
          title: '',
          date: new Timestamp(new Date('May 7, 2022 10:45:00').getTime()/1000, new Date().getMilliseconds()),
          group: '',
          description: '',
          content: ''
        };
        if(posts.length) {
          for(let p of posts) {
            latestPost = latestPost.date < p.date ? p : latestPost;
          }
          this.latestPosts.push(latestPost);
        }
      });
    }
    return of(this.latestPosts);
  }

  updateOpenGraph(title: string, description: string, image?: string) {
    this.meta.updateTag({property: 'og:title', content: title});
    this.meta.updateTag({property: 'og:description', content: description});
    if(image) {
      this.meta.updateTag({property: 'og:image', content: image});
    }
  }
  
}
