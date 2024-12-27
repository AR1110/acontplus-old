
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgClass } from '@angular/common';
import { Component, ElementRef, Input, output, ViewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';

@Component({
    selector: 'app-categories-tab',
    imports: [
        NgClass,
        MatTabsModule,
        ScrollingModule,
        OverlayscrollbarsModule,
    ],
    templateUrl: './categories-tab.component.html',
    styleUrl: './categories-tab.component.scss'
})
export class CategoriesTabComponent {
  @Input() currentIndex = 0;
  @Input() isLoading = false;
  @Input() tabs = [] as any[]
  selectTab=output<any>()



  getClass(index: number) {
    return {
      'active': this.currentIndex === index,
      'restricted': this.isLoading
    };
  }




}
