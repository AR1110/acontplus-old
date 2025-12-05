import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemVariantAddEdidt } from './item-variant-add-edidt';

describe('ItemVariantAddEdidt', () => {
  let component: ItemVariantAddEdidt;
  let fixture: ComponentFixture<ItemVariantAddEdidt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemVariantAddEdidt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemVariantAddEdidt);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
