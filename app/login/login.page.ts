import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { auth } from "firebase/app";
import { AlertController, LoadingController } from "@ionic/angular";
import { UserService } from "./../services/user.service";
import { Router } from "@angular/router";
// import { AngularFireDatabase } from "@angular/fire/database";
@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  constructor(
    public afAuth: AngularFireAuth,
    public user: UserService,
    public router: Router,
    public loadingController: LoadingController,
    public alertController: AlertController
  ) {}
  email: string = "";
  password: string = "";

  ngOnInit() {}
  async login() {
    const loading = await this.loadingController.create({
      message: "Please Wait"
    });
    await loading.present();
    const { email, password } = this;
    try {
      const res = await this.afAuth.auth.signInWithEmailAndPassword(
        email,
        password
      );
      if (res.user) {
        this.router.navigate(["/tabs"]);
        this.email = "";
        this.password = "";
       setTimeout(() =>  loading.dismiss(),2000)
      }
    } catch (error) {
      // if(error.code === 'auth/network-request-failed')
      if (
        error.code === "auth/invalid-email" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        loading.dismiss();
        this.presentAlert("failed", "Username or Password incorrect 🙂🙃");
      } else {
        loading.dismiss();
        this.presentAlert("lêu lêu", "Không Có mạng lên núi sống đi 😜😝😛");
      }
    }
  }
  register() {
    this.router.navigate(["/register"]);
  }
  async presentAlert(title: string, content: string) {
    const alert = await this.alertController.create({
      header: title,
      message: content,
      buttons: ["OK"]
    });

    await alert.present();
  }
}
