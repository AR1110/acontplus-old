import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseTransferComponent } from './warehouse-transfer.component';

describe('WarehouseTransferComponent', () => {
  let component: WarehouseTransferComponent;
  let fixture: ComponentFixture<WarehouseTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseTransferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
