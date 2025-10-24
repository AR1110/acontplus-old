import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseTransfer } from './warehouse-transfer';

describe('WarehouseTransfer', () => {
  let component: WarehouseTransfer;
  let fixture: ComponentFixture<WarehouseTransfer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseTransfer],
    }).compileComponents();

    fixture = TestBed.createComponent(WarehouseTransfer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
