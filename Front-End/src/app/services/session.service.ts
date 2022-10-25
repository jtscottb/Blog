import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Firestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private app: FirebaseApp = initializeApp(environment.firebase);
  private db: Firestore = getFirestore(this.app);

  private isAdmin = new BehaviorSubject<boolean>(false);

  constructor() { }

  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    this.setIsAdmin(!user.isAnonymous);
  }

  getUser(): Observable<any> {
    let user = localStorage.getItem('user');
    user = user ? JSON.parse(user) : null;
    return of(user);
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): Observable<string | null> {
    return of(localStorage.getItem('token'));
  }

  setPost(post: Post) {
    localStorage.setItem('post', JSON.stringify(post));
  }

  getPost(): Observable<any> {
    let post = localStorage.getItem('post');
    post = post ? JSON.parse(post) : null;
    return of(post);
  }

  setIsAdmin(value: boolean) {
    this.isAdmin.next(value);
  }

  getIsAdmin(): Observable<boolean> {
    return this.isAdmin;
  }

}
