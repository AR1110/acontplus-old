import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSearchDialog } from './item-search-dialog';

describe('ItemSearchDialog', () => {
  let component: ItemSearchDialog;
  let fixture: ComponentFixture<ItemSearchDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemSearchDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemSearchDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
