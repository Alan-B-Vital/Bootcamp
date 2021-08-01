import { Component, Inject, OnInit } from '@angular/core'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { RestaurantesService } from '../shared/restaurantes.service'

@Component({
  selector: 'app-restaurante',
  templateUrl: './restaurante.component.html',
  styleUrls: ['./restaurante.component.scss']
})
export class RestauranteComponent implements OnInit {
  mediaGeral: any[] = []

  ratingArr: number[] = []
  rating: number = 5
  starCount: number = 5

  usuario_rating: number = 3
  usuario_ratingArr: number[] = []
  comentarios_usuarios_ratingArr: number[] = []

  comentario_usuario: any
  comentarios_usuarios: any[] = []

  constructor (
    public dialogRef: MatDialogRef<RestauranteComponent>,
    @Inject(MAT_DIALOG_DATA) public restaurante: any,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private readonly _restauranteService: RestaurantesService
  ) { }

  ngOnInit (): void {
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index)
    }

    for (let index = 0; index < this.starCount; index++) {
      this.usuario_ratingArr.push(index)
    }

    for (let index = 0; index < this.starCount; index++) {
      this.comentarios_usuarios_ratingArr.push(index)
    }

    this.listarComentarios(this.restaurante.estrelas)
  }

  showIcon (contagem: number, index: number): string {
    if (contagem >= index + 1) {
      return 'star'
    } else {
      return 'star_border'
    }
  }

  onClick (rating: number): boolean {
    this.usuario_rating = rating
    return false
  }

  enviarComentario (): void {
    this._restauranteService
      .criaComentarioDousuario(this.restaurante.id, 'idprovisorio', {
        comentario: this.comentario_usuario,
        estrelas: this.usuario_rating,
        comentadoEm: new Date(),
        autor: {
          nome: 'bootcamper',
          foto: '',
          uid: 'idprovisorio'
        }
      }).then(async () => { this.comentario_usuario = '' }).catch()
  }

  listarComentarios (param: number): any {
    this.mediaGeral = []
    this._restauranteService.listaComentariosDoRestaurante(this.restaurante.id)
      .subscribe(comentarios => {
        this.comentarios_usuarios = comentarios.map(comentario => comentario)
        comentarios.forEach(comentario => {
          return this.mediaGeral.push(comentario.estrelas)
        })
        this.mediaGeral.push(param)
        const sum = this.mediaGeral.reduce((a: number, b: number) => a + b, 0)
        const toDisplay = Math.round(sum / this.mediaGeral.length)
        this.rating = toDisplay
        return this.rating
      })
  }

  excluirComentario (comentario: any): void {
    if (window.confirm('Deseja mesmo excluir esse comentário?')) {
      this._restauranteService.excluirComentario(this.restaurante.id, comentario.autor.uid)
      this.snackBar.open('Comentário excluido com sucesso.', 'X', {
        verticalPosition: 'top',
        horizontalPosition: 'right',
        duration: 5000
      })
    }
  }

  formataData (seconds: number): string {
    const data = new Date(seconds * 1000).toLocaleDateString()
    const horario = new Date(seconds * 1000).toLocaleTimeString()

    return `${data} às ${horario}`
  }
}
