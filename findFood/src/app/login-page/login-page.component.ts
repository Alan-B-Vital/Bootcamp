import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from '../auth/auth.service'

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  constructor (
    private readonly _authService: AuthService,
    private readonly router: Router
  ) { }

  entrarComGoogle (): void {
    this._authService.entrarComGoogle()
      .then(() => {
        this.router.navigateByUrl('home')
          .catch(() => {})
      })
      .catch(() => {})
  }
}
