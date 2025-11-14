import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformaDetail } from './proforma-detail';

describe('ProformaDetail', () => {
  let component: ProformaDetail;
  let fixture: ComponentFixture<ProformaDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProformaDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(ProformaDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
