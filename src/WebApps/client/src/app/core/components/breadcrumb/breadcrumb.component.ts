import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class BreadcrumbComponent implements OnInit {
  @Output() clicked = new EventEmitter<void>();
  @Input() crear = false;
  parentData: any;
  childData: any;

  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.parentData = this.route.parent?.snapshot.data;
    this.childData = this.route.snapshot.data;
    // console.log(this.parentData);
    // console.log(this.childData);
  }

  onClick() {
    this.clicked.emit();
  }
}
