import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversalSearchComponent } from './universal-search.component';

describe('UniversalSearchComponent', () => {
  let component: UniversalSearchComponent;
  let fixture: ComponentFixture<UniversalSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniversalSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniversalSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
