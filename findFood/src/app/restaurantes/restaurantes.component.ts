import { NovoRestauranteComponent } from './../novo-restaurante/novo-restaurante.component'
import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { RestauranteComponent } from '../restaurante/restaurante.component'
import { RestaurantesService } from '../shared/restaurantes.service'

@Component({
  selector: 'app-restaurantes',
  templateUrl: './restaurantes.component.html',
  styleUrls: ['./restaurantes.component.scss']
})
export class RestaurantesComponent implements OnInit {
  toSearch: any = ''
  siglas: any[] = []

  restaurantes: any[] = []

  constructor (
    private readonly _http: HttpClient,
    private readonly dialog: MatDialog,
    private readonly _restaurantesService: RestaurantesService
  ) { }

  ngOnInit (): void {
    this.listarRestaurantes().catch(() => {}) // pegando lista de restaurantes
    this._http.get('https://servicodados.ibge.gov.br/api/v1/localidades/regioes/1|2|3|4|5/estados').subscribe((res: any) => { // pegando lista de cidades/estados brasileiros
      let estados = res
      estados = estados.sort((a: any, b: any) => (a.nome > b.nome) ? 1 : -1)
      estados.forEach((estado: any) => {
        this.siglas.push({
          nome: estado.nome,
          sigla: estado.sigla
        })
      })
    })
  }

  async listarRestaurantes (): Promise<void> { // pega lsita de restaurantes do firestore
    await this._restaurantesService.listarRestaurantes()
      .subscribe(rests => {
        this.restaurantes = rests.map(rest => rest)
        this.restaurantes = this.restaurantes.sort((a, b) => b.criadoEm.seconds - a.criadoEm.seconds)
      })
  }

  novoRestaurante (): void { // criado novo restaurante
    const dialogRef = this.dialog.open(NovoRestauranteComponent, {
      width: '80%',
      height: 'max-content',
      data: {
        usuario: '',
        siglas: this.siglas
      }
    })

    dialogRef.afterClosed().subscribe((data: any) => {
      this.restaurantes.push(data)
    })
  }

  abrirRestaurante (restaurante: any): void { // abre modal de restaurante selecionado
    this.dialog.open(RestauranteComponent, {
      width: '80%',
      height: '98vh',
      data: restaurante,
      panelClass: 'custom-dialog-container'
    })
  }

  sair (): void {
    console.log('até mais')
  }
}
