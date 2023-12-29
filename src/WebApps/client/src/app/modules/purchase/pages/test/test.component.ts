import { Component, inject } from '@angular/core';
import { ActivatedRoute, Route, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {

  router: Router = inject(Router); 
  clickMe(){
    this.router.navigate(['/', "purchase", "reports-page"]);
  }
}
