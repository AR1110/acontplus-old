import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLayoutComponent } from './new-layout.component';

describe('NewLayoutComponent', () => {
  let component: NewLayoutComponent;
  let fixture: ComponentFixture<NewLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
