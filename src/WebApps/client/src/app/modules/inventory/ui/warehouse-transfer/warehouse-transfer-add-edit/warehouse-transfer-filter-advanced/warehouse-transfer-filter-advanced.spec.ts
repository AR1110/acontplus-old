import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseTransferFilterAdvanced } from './warehouse-transfer-filter-advanced';

describe('WarehouseTransferFilterAdvanced', () => {
  let component: WarehouseTransferFilterAdvanced;
  let fixture: ComponentFixture<WarehouseTransferFilterAdvanced>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseTransferFilterAdvanced]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseTransferFilterAdvanced);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
