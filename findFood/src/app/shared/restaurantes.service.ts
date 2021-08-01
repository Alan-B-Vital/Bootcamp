import { Injectable } from '@angular/core'
import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFireStorage } from '@angular/fire/storage'
import { finalize } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class RestaurantesService {
  constructor (
    private readonly _fireStore: AngularFirestore,
    private readonly _fireStorage: AngularFireStorage
  ) { }

  private readonly basePath = '/restaurantes'

  criaRestaurante (avaliacao: any, fileupload: any): void {
    const restaurantes = this._fireStore.collection('restaurantes')
    restaurantes.add({ ...avaliacao, downloadUrl: fileupload }).then(async doc => await doc.update({ id: doc.id })).catch((err) => console.log(err))
  }

  listarRestaurantes (): any {
    return this._fireStore.collection('restaurantes').valueChanges()
  }

  pushFileToStorage (avaliacao: any, fileUpload: any): void {
    const filePath = `${this.basePath}/${String(fileUpload.name)}_${String(avaliacao.nome)}_${new Date().toDateString()}`
    const storageRef = this._fireStorage.ref(filePath)
    const uploadTask = this._fireStorage.upload(filePath, fileUpload)

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          fileUpload.url = downloadURL
          this.criaRestaurante(avaliacao, fileUpload.url)
        })
      })
    ).subscribe()
  }

  criaComentarioDousuario (idRestaurante: string, idUsuario: string, avaliacao: object): any {
    return this._fireStore.collection('restaurantes')
      .doc(idRestaurante).collection('avaliações').doc(idUsuario).set(avaliacao)
  }

  listaComentariosDoRestaurante (idRestaurante: string): any {
    return this._fireStore.collection('restaurantes')
      .doc(idRestaurante).collection('avaliações').valueChanges()
  }

  excluirComentario (idRestaurante: string, idUsuario: string): any {
    return this._fireStore.collection('restaurantes')
      .doc(idRestaurante).collection('avaliações').doc(idUsuario).delete()
  }
}
