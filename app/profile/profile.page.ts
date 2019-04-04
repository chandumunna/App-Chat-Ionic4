import { Component, OnInit } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";
import { AngularFireDatabase } from "@angular/fire/database";
import {
  AlertController,
  LoadingController,
  ActionSheetController
} from "@ionic/angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { UserService } from "./../services/user.service";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { File } from "@ionic-native/File/ngx";
import { AuthService } from "./../services/auth.service";
@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"]
})
export class ProfilePage implements OnInit {
  files: Observable<any[]>;
  userProfile: any = {};
  UID: any;
  showInput: boolean = false;
  newUsername: string = "";
  showInputPass: boolean = false;
  newPass: string = "";
  oldPass: string = "";
  currentImage: any;
  constructor(
    private storage: AngularFireStorage,
    private db: AngularFireDatabase,
    private alertCtrl: AlertController,
    public loadingController: LoadingController,
    public User: UserService,
    private camera: Camera,
    private file: File,
    private actionSheetController: ActionSheetController,
    public auth: AuthService
  ) {
    this.UID = User.getUID();
    this.GetDataUser();
  }
  ngOnInit() {}
  logout() {
    this.auth.logout();
  }
  async GetDataUser() {
    await this.GetProfileUser().subscribe(
      async res => await (this.userProfile = res[0])
    );
  }
  GetProfileUser() {
    return this.db
      .list("/users", ref => ref.orderByChild("uid").equalTo(this.UID))
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
        })
      );
  }
  EditUserName() {
    this.showInput = !this.showInput;
    if (this.newUsername.trim() !== "") {
      this.db
        .list("users")
        .update(this.userProfile.key, { username: this.newUsername });
      this.newUsername = "";
      this.presentAlert("Success", "updated username success");
    }
  }

  async EditPassWord() {
    this.showInputPass = !this.showInputPass;
    if (this.newPass !== "" && this.oldPass !== "") {
      try {
        console.log(this.userProfile.email);
        await this.User.reAuth(this.userProfile.email, this.oldPass);
        await this.User.updatePassword(this.newPass);
        this.presentAlert("Success", "updated password success");
      } catch (error) {
        console.log(error);
      }
    }
  }

  async presentAlert(title: string, content: string) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: content,
      buttons: ["OK"]
    });

    await alert.present();
  }

  removeFile(imguser) {
    return this.storage.ref(imguser).delete();
  }
  async uploadFile(event, key, fullPathold) {
    let file = event.target.files[0];

    const filePath = `photos/${this.User.getUID()}/${file.name}`;
    let task = await this.storage.upload(filePath, file);

    const fileRef = this.storage.ref(filePath);
    let url = await fileRef.getDownloadURL();

    url.subscribe(res => this.uploadImageUser(key, fullPathold, res, filePath));
  }

  uploadImageUser(key, fullPathold, urlImg, fullPathnew) {
    let task = this.db
      .list("users")
      .update(key, { fullPath: fullPathnew, imguser: urlImg });
    if (fullPathold !== "") {
      this.removeFile(fullPathold);
    }
  }

  async pickImage(key, fullPathold, PictureSourceType) {
    const options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType:
        this.camera.EncodingType.JPEG | this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: PictureSourceType
    };

    const loading = await this.loadingController.create({
      message: "Đợi chờ là hạnh phúc 👫👪👨‍👩‍👧‍👧 😜  "
    });

    try {
      await loading.present().then(async () => {
        let cameraInfo = await this.camera.getPicture(options);
        let blobInfo: any = await this.makeFileIntoBlob(cameraInfo);
        let imgPath = `photos/${this.User.getUID()}/` + blobInfo.fileName;
        await this.storage.upload(imgPath, blobInfo.imgBlob);
        await this.storage
          .ref(imgPath)
          .getDownloadURL()
          .subscribe(async urlImg => {
            await this.uploadImageUser(key, fullPathold, urlImg, imgPath);
            if (PictureSourceType === this.camera.PictureSourceType.CAMERA) {
              setTimeout(() => loading.dismiss(), 4000);
              setTimeout(
                () => this.presentAlert("Success", "updated image success"),
                4200
              );
            } else {
              setTimeout(() => loading.dismiss(), 2000);
              setTimeout(
                () => this.presentAlert("Success", "updated image success"),
                2100
              );
            }
          });
      });
    } catch (e) {
      loading.dismiss();
    }
  }
  makeFileIntoBlob(_imagePath) {
    return new Promise((resolve, reject) => {
      let fileName = "";
      this.file
        .resolveLocalFilesystemUrl(_imagePath)
        .then(fileEntry => {
          let { name, nativeURL } = fileEntry;
          let path = nativeURL.substring(0, nativeURL.lastIndexOf("/"));

          fileName = name;

          return this.file.readAsArrayBuffer(path, name);
        })
        .then(buffer => {
          let imgBlob = new Blob([buffer], {
            type: "image/jpeg"
          });
          console.log(imgBlob.type, imgBlob.size);
          resolve({
            fileName,
            imgBlob
          });
        })
        .catch(e => reject(e));
    });
  }

  async takePicture(key, fullPathold) {
    const actionSheet = await this.actionSheetController.create({
      header: "Albums",
      buttons: [
        {
          text: "Use Camera",
          role: "destructive",
          icon: "camera",
          handler: () => {
            this.pickImage(
              key,
              fullPathold,
              this.camera.PictureSourceType.CAMERA
            );
          }
        },
        {
          text: "Load from Library ",
          icon: "image",
          handler: () => {
            this.pickImage(
              key,
              fullPathold,
              this.camera.PictureSourceType.PHOTOLIBRARY
            );
          }
        },
        {
          text: "Cancel",
          icon: "close",
          role: "cancel"
        }
      ]
    });
    await actionSheet.present();
  }
}
