import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformaInvoiceDetail } from './proforma-invoice-detail';

describe('ProformaInvoiceDetail', () => {
  let component: ProformaInvoiceDetail;
  let fixture: ComponentFixture<ProformaInvoiceDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProformaInvoiceDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProformaInvoiceDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
