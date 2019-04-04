import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { first } from "rxjs/operators";
import { auth } from "firebase/app";
@Injectable()
export class UserService {
  constructor(
    private afAuth: AngularFireAuth,
  ) {}

  getUID(): string {
    return this.afAuth.auth.currentUser.uid;
  }

  getEmail() {
    return this.afAuth.auth.currentUser.email;
  }
  reAuth(email: string, password: string) {
    return this.afAuth.auth.currentUser.reauthenticateWithCredential(
      auth.EmailAuthProvider.credential(email, password)
    );
  }

  updatePassword(newpassword: string) {
    return this.afAuth.auth.currentUser.updatePassword(newpassword);
  }

  updateEmail(newemail: string) {
    return this.afAuth.auth.currentUser.updateEmail(newemail);
  }

  async isAuthenticated() {
    if (this.afAuth.auth.currentUser) return true;

    const user = await this.afAuth.authState.pipe(first()).toPromise();

    if (user) {
      return true;
    }
    return false;
  }
}
