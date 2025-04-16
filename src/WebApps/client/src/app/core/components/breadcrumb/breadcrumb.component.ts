import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  imports: [],
  templateUrl: './breadcrumb.component.html',
  styles: ``,
})
export class BreadcrumbComponent implements OnInit {
  parentData:  any;
  childData: any;
  private readonly _activatedRoute = inject(ActivatedRoute);

  ngOnInit() {
    this.parentData = this._activatedRoute.parent?.snapshot.data;
    this.childData = this._activatedRoute.snapshot.data;
  }
}
