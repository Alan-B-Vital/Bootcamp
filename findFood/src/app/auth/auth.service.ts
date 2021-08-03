import { Injectable } from '@angular/core'

import firebase from 'firebase/app'
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore } from '@angular/fire/firestore'
import { Router } from '@angular/router'
import { Observable, of } from 'rxjs'
import { switchMap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<any>

  constructor (
    private readonly _fireAuth: AngularFireAuth,
    private readonly _fireStore: AngularFirestore,
    private readonly router: Router
  ) {
    this.user = this._fireAuth.authState
      .pipe(switchMap((user: any) => {
        if (user !== null && user !== undefined) {
          return this._fireStore.doc(`usuarios/${String(user.uid)}`).valueChanges()
        } else {
          return of(null)
        }
      })
      )
  }

  async entrarComGoogle (): Promise<void> {
    const provider = new firebase.auth.GoogleAuthProvider()
    const credential = await this._fireAuth.signInWithPopup(provider)

    this.atualizaInformacoesDoUsuario(credential.user)
  }

  async sair (): Promise<any> {
    await this._fireAuth.signOut()
    return await this.router.navigate(['/']).catch(() => {})
  }

  private atualizaInformacoesDoUsuario ({ uid, email, displayName, photoURL }: any): any {
    const referenciaUsuario = this._fireStore.doc(`usuarios/${String(uid)}`)
    const usuario = {
      uid,
      email,
      displayName,
      photoURL
    }

    return referenciaUsuario.set(usuario)
  }
}
