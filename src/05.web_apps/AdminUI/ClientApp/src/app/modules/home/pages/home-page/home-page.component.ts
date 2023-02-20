import { HttpClient } from '@angular/common/http';
import { Component, Inject, inject } from '@angular/core';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {

  title = "AcontPlus"


  constructor( @Inject("BASE_URL") private baseUrl: string, private http: HttpClient){
    http.get(baseUrl + 'api/Entidad/Get/' + JSON.stringify({test: ''})).subscribe(response=>{

    })
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

}
