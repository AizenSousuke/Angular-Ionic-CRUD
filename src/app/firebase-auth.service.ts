import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoadingServiceService } from './loading-service.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {

  firebaseAuthRef: firebase.auth.Auth;
  provider;

  // User
  currentUser: firebase.User;

  constructor(private _toastController: ToastController,
              private _angularFireAuth: AngularFireAuth,
              private _loadingService: LoadingServiceService) {
    this.ngOnInit();
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log("Init firebase auth service");
    this.firebaseAuthRef = firebase.auth();
    // Set an observable to change the logged in state of the app
    this.checkLoggedIn();
  }

  checkLoggedIn() {
    this._angularFireAuth.authState.subscribe(user => {
      if (user) {
        this.currentUser = user;
        console.log("This user is logged in: " + this.currentUser.email);
      } else {
        this.currentUser = null;
        console.log("There is no user logged in.");
      }
    })
  }

  onSignIn(provider: string) {
    console.log("Signing in");
    if (provider == "Github") {
      this.provider = new firebase.auth.GithubAuthProvider();
    } else if (provider == "Google") {
      this.provider = new firebase.auth.GoogleAuthProvider();
    }
    this._loadingService.presentLoading();
    this.firebaseAuthRef.signInWithPopup(this.provider).then(result => {
      console.log(result);
      this.currentUser = result.user;
      console.log(this.currentUser);
      this._loadingService.dismissLoading();
      return this.presentToast("Logged in successfully");
    }).catch(reason => {
      this.presentToast(reason.message.toString());
    });
  }

  onSignOut() {
    console.log("Signing out");
    this._loadingService.presentLoading();
    this.firebaseAuthRef.signOut().then(result => {
      this.currentUser = null;
      console.log(this.currentUser);
      this._loadingService.dismissLoading();
      this.presentToast("Signed out successfully");
    }).catch(reason => {
      this.presentToast(reason.message.toString());
    })
  }

  async presentToast(message: string, duration: number = 2000) {
    const toast = await this._toastController.create({
      message: message,
      duration: duration,
      color: 'primary',
    });
    toast.present();
  }
}
