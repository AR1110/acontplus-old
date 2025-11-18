import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionForm } from './promotion-form';

describe('PromotionForm', () => {
  let component: PromotionForm;
  let fixture: ComponentFixture<PromotionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromotionForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
