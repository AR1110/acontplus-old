import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessAuthorizationComponent } from './access-authorization.component';

describe('AccessAuthorizationComponent', () => {
  let component: AccessAuthorizationComponent;
  let fixture: ComponentFixture<AccessAuthorizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessAuthorizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
