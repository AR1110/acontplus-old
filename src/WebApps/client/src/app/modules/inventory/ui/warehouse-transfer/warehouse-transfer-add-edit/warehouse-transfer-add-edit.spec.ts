import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseTransferAddEdit } from './warehouse-transfer-add-edit';

describe('WarehouseTransferAddEdit', () => {
  let component: WarehouseTransferAddEdit;
  let fixture: ComponentFixture<WarehouseTransferAddEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseTransferAddEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseTransferAddEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
