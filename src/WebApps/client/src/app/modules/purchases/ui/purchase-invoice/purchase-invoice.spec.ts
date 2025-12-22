import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseInvoice } from './purchase-invoice';

describe('PurchaseInvoice', () => {
  let component: PurchaseInvoice;
  let fixture: ComponentFixture<PurchaseInvoice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseInvoice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseInvoice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
