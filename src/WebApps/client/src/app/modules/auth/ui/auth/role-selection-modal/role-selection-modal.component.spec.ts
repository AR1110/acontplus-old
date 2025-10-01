import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleSelectionModalComponent } from './role-selection-modal.component';

describe('RoleSelectionModalComponent', () => {
  let component: RoleSelectionModalComponent;
  let fixture: ComponentFixture<RoleSelectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleSelectionModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleSelectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
