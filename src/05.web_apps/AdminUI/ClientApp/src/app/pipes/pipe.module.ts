import { NgModule } from "@angular/core";
import { EstadoColorPipe } from "./estado-color.pipe";


@NgModule({
  imports:[],
  declarations:[
    EstadoColorPipe
  ],
  exports:[
    EstadoColorPipe
  ]
})

export class PipeModule{


}
