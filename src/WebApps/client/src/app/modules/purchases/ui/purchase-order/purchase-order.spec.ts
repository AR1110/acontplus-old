import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrder } from './purchase-order';

describe('PurchaseOrder', () => {
  let component: PurchaseOrder;
  let fixture: ComponentFixture<PurchaseOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseOrder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
