import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchInputTriggerComponent } from './search-input-trigger.component';

describe('SearchInputTriggerComponent', () => {
  let component: SearchInputTriggerComponent;
  let fixture: ComponentFixture<SearchInputTriggerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchInputTriggerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchInputTriggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
