import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionList } from './promotion-list';

describe('PromotionList', () => {
  let component: PromotionList;
  let fixture: ComponentFixture<PromotionList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromotionList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
