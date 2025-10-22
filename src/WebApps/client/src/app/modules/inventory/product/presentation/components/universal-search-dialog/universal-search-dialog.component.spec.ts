import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversalSearchDialogComponent } from './universal-search-dialog.component';

describe('UniversalSearchDialogComponent', () => {
  let component: UniversalSearchDialogComponent;
  let fixture: ComponentFixture<UniversalSearchDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniversalSearchDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniversalSearchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
