import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformaAddEdit } from './proforma-add-edit';

describe('ProformaAddEdit', () => {
  let component: ProformaAddEdit;
  let fixture: ComponentFixture<ProformaAddEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProformaAddEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(ProformaAddEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
