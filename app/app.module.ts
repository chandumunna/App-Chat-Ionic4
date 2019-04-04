import { NgModule } from '@angular/core';
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import firebaseConfig from "./firebase";
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule,StorageBucket } from "@angular/fire/storage";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AuthService } from "./services/auth.service";
import { UserService } from "./services/user.service";
import { FirestoreSettingsToken } from "@angular/fire/firestore";
// import { FilePath } from '@ionic-native/file-path/ngx'
import { File } from '@ionic-native/File/ngx';
// import { WebView } from '@ionic-native/ionic-webview/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule,
    AngularFireDatabaseModule
     // imports firebase/storage only needed for storage features
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: FirestoreSettingsToken, useValue: {} },
    // { provide: StorageBucket, useValue: 'my-bucket-name' },
    UserService,
    AuthService,
    File,

  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
