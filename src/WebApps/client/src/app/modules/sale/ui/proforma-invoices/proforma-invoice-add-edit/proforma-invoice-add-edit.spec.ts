import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformaInvoiceAddEdit } from './proforma-invoice-add-edit';

describe('ProformaInvoiceAddEdit', () => {
  let component: ProformaInvoiceAddEdit;
  let fixture: ComponentFixture<ProformaInvoiceAddEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProformaInvoiceAddEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProformaInvoiceAddEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
