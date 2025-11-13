import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionAddEdit } from './promotion-add-edit';

describe('PromotionAddEdit', () => {
  let component: PromotionAddEdit;
  let fixture: ComponentFixture<PromotionAddEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionAddEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromotionAddEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
