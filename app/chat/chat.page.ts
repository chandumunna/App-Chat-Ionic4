import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AngularFireDatabase } from "@angular/fire/database";
import { map } from "rxjs/operators";
import { UserService } from "./../services/user.service";
import { IonContent, NavParams, ModalController } from "@ionic/angular";
@Component({
  selector: "app-chat",
  templateUrl: "./chat.page.html",
  styleUrls: ["./chat.page.scss"]
})
export class ChatPage implements OnInit {
  key: any;
  userchat: any;
  mess: string;
  uidhome: any;
  userhome: any;
  messages: any[];
  @ViewChild("content") Content: IonContent;

  constructor(
    private User: UserService,
    private route: ActivatedRoute,
    private db: AngularFireDatabase,
    public modalController: ModalController,
    // private navParams: NavParams
  ) {
    this.key = route.snapshot.paramMap.get("key");
    // this.key = this.navParams.get("key");
    this.userchat = this.GetUserChat();
    this.uidhome = User.getUID();
    this.GetUserHome().subscribe(res => (this.userhome = res[0]));
    this.scrollto()
    this.GetChats();
  }

  GetUserHome() {
    return this.db
      .list("/users", ref => ref.orderByChild("uid").equalTo(this.uidhome))
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
        })
      );
  }
  GetUserChat() {
    let obj = {};
    this.db
      .list(`users/${this.key}`)
      .snapshotChanges()
      .subscribe(actions => {
        return actions.map(a => {
          const value = a.payload.val();
          const key = a.key;
          obj[key] = value;
        });
      });
    return obj;
  }
  ngOnInit() {
  }
  async sendMessage() {
    const data = {
      uid: this.uidhome,
      mess: this.mess,
      time: new Date().getTime()
    };
    this.db.list(`users/${this.key}/chats/${this.uidhome}`).push(data);
    this.db
      .list(`users/${this.userhome.key}/chats/${this.userchat.uid}`)
      .push(data)
      .then(() => {
        this.mess = "";
        try {
          this.Content.scrollToBottom(300);
        } catch (error) {
          console.log(error);
        }
      });
  }
  GetChats() {
    this.db
      .list(`users/${this.key}/chats/${this.uidhome}`)
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
        })
      )
      .subscribe(data => {
        this.messages = data;
        this.scrollto();
      });
  }

  scrollto() {
    setTimeout(() => {
      this.Content.scrollToBottom(300);
    }, 100);
  }

  // close() {
  //   this.modalController.dismiss();
  // }
}
