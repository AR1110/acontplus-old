import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixTempLayout } from './fix-temp-layout';

describe('FixTempLayout', () => {
  let component: FixTempLayout;
  let fixture: ComponentFixture<FixTempLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FixTempLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixTempLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
