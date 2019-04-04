import { Component } from "@angular/core";
import { AuthService } from "./../services/auth.service";
import { UserService } from "./../services/user.service";
import {
  LoadingController,
  AlertController,
  ModalController
} from "@ionic/angular";
import { AngularFireDatabase } from "@angular/fire/database";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ChatPage } from '../chat/chat.page'
@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage {
  user: any;
  uid: any;
  users: Observable<any[]>;
  constructor(
    public auth: AuthService,
    public User: UserService,
    private db: AngularFireDatabase,
    public loadingController: LoadingController,
    public alertController: AlertController,
    public modalController: ModalController
  ) {
    this.uid = User.getUID();
    this.GetUsers();
  }
  GetUsers() {
    this.users = this.db
      .list(`users`)
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
        })
      );
  }

  async presentAlert(title: string, content: string) {
    const alert = await this.alertController.create({
      header: title,
      message: content,
      buttons: ["OK"]
    });

    await alert.present();
  }
 async openChat(key) {
    const modal = await this.modalController.create({
      component: ChatPage,
      componentProps: { key: key }
    });
    return await modal.present();
  }
}
