import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionViewDetail } from './promotion-view-detail';

describe('PromotionViewDetail', () => {
  let component: PromotionViewDetail;
  let fixture: ComponentFixture<PromotionViewDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionViewDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(PromotionViewDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
