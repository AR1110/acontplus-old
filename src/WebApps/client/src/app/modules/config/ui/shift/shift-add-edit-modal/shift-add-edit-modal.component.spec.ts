import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftAddEditModalComponent } from './shift-add-edit-modal.component';

describe('ShiftAddEditModalComponent', () => {
  let component: ShiftAddEditModalComponent;
  let fixture: ComponentFixture<ShiftAddEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftAddEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftAddEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
