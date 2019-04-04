import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
// import { auth } from "firebase/app";
import { AlertController } from "@ionic/angular";
import { Router } from "@angular/router";
// import { Observable } from "rxjs";
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "@angular/fire/firestore";
import { UserService } from "./../services/user.service";
import { AngularFireDatabase } from "@angular/fire/database";
@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"]
})
export class RegisterPage implements OnInit {
  email: string = "";
  username: string = "";
  password: string = "";
  cpassword: string = "";
  constructor(
    public afAuth: AngularFireAuth,
    public afstore: AngularFirestore,
    public alertController: AlertController,
    public router: Router,
    public user: UserService,
    private db: AngularFireDatabase
  ) {}

  ngOnInit() {}

  async register() {
    const { email, username, password, cpassword } = this;
    if (password !== cpassword) {
      return this.presentAlert("Fail", "Passwords don't match");
    }

    try {
      const res = await this.afAuth.auth.createUserWithEmailAndPassword(
        email,
        password
      );
      const user = {
        email: email,
        uid: res.user.uid,
        username: username,
        fullPath: ``,
        created: new Date().getTime().toString(),
        imguser:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7nhDxJ4D5vIkW3RynJY9592SCVjocjrUgGVFo-_LhdxFRYyIHdQ"
      };
      this.db.list(`users`).push(user);
      this.presentAlert("Success", "You are registered!");
      this.router.navigate(["/login"]);
      this.email = "";
      this.username = "";
      this.password = "";
      this.cpassword = "";
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        this.presentAlert("Failed", "Invalid Email 🙂🙃 !");
      } else {
        if (error.code === "auth/email-already-in-use ") {
          this.presentAlert("Failed", "Email already exists 🙂🙃!");
        } else {
          this.presentAlert("lêu lêu", "Không Có mạng lên núi sống đi 😜 😝 😛");
        }
      }
    }
  }
  async presentAlert(title: string, content: string) {
    const alert = await this.alertController.create({
      header: title,
      message: content,
      buttons: ["OK"]
    });

    await alert.present();
  }
  back() {
    this.router.navigate(["/login"]);
  }
}
