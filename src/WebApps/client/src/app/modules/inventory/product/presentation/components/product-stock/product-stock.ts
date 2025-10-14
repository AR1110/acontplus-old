import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {GetEstabStockUseCase} from "@inventory/product/application/use-cases/product.use-case";

@Component({
  selector: 'app-product-stock',
  imports: [],
  templateUrl: './product-stock.html',
  styleUrl: './product-stock.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductStock {
  id = input.required<number>()
  private $useCase = inject(GetEstabStockUseCase);


  ngOnInit(){
    console.log(this.id())
    this.$useCase.execute(this.id()).subscribe(response => {
      console.log(response)
    })
  }
}
