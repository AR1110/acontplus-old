import { Component, inject } from '@angular/core';
import { InventoryModule } from '@modules/inventory/inventory.module';
import { CategoryService } from '@modules/inventory/services/category.service';
import { AppModule } from 'src/app/app.module';

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [AppModule, InventoryModule],
  templateUrl: './category-page.component.html',
  styles: ``
})
export class CategoryPageComponent {
  private categorySvc = inject(CategoryService)

  dataSearch = {
    pageIndex: 1,
    pageSize: 25,
    maxSize: 5,
    totalRecords: 0
  }
  getCatgories(){
    this.categorySvc.getAll({}).subscribe({
      
    })
  }
}
