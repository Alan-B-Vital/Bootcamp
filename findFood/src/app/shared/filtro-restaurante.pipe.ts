import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'filtroRestaurante'
})
export class FiltroRestaurantePipe implements PipeTransform {
  transform (value: any, args?: any): any {
    if (value === null) return null
    if (args === null) return value
    args = args.toLowerCase()
    return value.filter((data: any) => {
      return JSON.stringify(data).toLowerCase().includes(args)
    })
  }
}
