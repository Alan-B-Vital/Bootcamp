import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'
import { Observable } from 'rxjs'

import { AuthService } from './auth.service'
import { take, tap, map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor (
    private readonly _auth: AuthService,
    private readonly _router: Router
  ) { }

  canActivate (): Observable<boolean> {
    return this._auth.user.pipe(
      take(1),
      map(user => {
        return user !== null
      }),
      tap(loggedin => {
        if (!loggedin) {
          this._router.navigateByUrl('login').catch(() => {})
        }
      })
    )
  }
}
