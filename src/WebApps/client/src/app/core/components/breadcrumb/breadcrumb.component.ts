import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './breadcrumb.component.html',
  styles: ``,
})
export class BreadcrumbComponent {
  parentData: any;
  childData: any;
  #route = inject(ActivatedRoute);

  ngOnInit() {
    this.parentData = this.#route.parent?.snapshot.data;
    this.childData = this.#route.snapshot.data;
    // console.log(this.parentData);
    // console.log(this.childData);
  }
}
