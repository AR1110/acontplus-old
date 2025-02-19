import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosSaleComponent } from './pos-sale.component';

describe('PosSaleComponent', () => {
  let component: PosSaleComponent;
  let fixture: ComponentFixture<PosSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosSaleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
