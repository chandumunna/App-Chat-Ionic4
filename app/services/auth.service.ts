import { Injectable } from '@angular/core'
import { Router, CanActivate } from '@angular/router'
import { UserService } from './user.service'
import { AngularFireAuth } from '@angular/fire/auth';
@Injectable()
export class AuthService implements CanActivate {

	constructor(private router: Router, private user: UserService,public afAuth: AngularFireAuth) {

	}

	async canActivate() {
		if(await this.user.isAuthenticated()) {
			return true
		}

		this.router.navigate(['/login'])
		return false
  }
  async logout() {
		await this.afAuth.auth.signOut()
    this.router.navigate(['/login'])
   }
}