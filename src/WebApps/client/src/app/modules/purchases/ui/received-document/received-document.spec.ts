import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivedDocument } from './received-document';

describe('ReceivedDocument', () => {
  let component: ReceivedDocument;
  let fixture: ComponentFixture<ReceivedDocument>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceivedDocument]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceivedDocument);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
