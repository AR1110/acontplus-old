import { Component, inject } from '@angular/core';
import { ActivatedRoute, Route, Router, RouterOutlet } from '@angular/router';
import { AppModule } from 'src/app/app.module';


@Component({
  selector: 'app-test',
  standalone: true,
  imports: [AppModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {

  router: Router = inject(Router);
  clickMe(){
    this.router.navigate(['/', "inventory", "subcategory-page"]);
  }

  

}
