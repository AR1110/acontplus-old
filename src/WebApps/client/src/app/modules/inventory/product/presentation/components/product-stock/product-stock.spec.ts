import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductStock } from './product-stock';

describe('ProductStock', () => {
  let component: ProductStock;
  let fixture: ComponentFixture<ProductStock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductStock]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductStock);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
