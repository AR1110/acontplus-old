import { Component, inject } from '@angular/core';
import { ModalService } from '@core/services/modal.service';
import { AppModule } from 'src/app/app.module';
import { AnticipoModalComponent } from './anticipo-modal/anticipo-modal.component';

@Component({
  selector: 'app-anticipo',
  standalone: true,
  imports: [AppModule],
  templateUrl: './anticipo.component.html',
  styleUrl: './anticipo.component.scss'
})
export class AnticipoComponent {

  private modalSvc = inject(ModalService)



  openModal<T>(data?:T){
    const modalRef = this.modalSvc.openModalCustom(AnticipoModalComponent);
    modalRef.componentInstance.params = data;

    modalRef.result.then(result=>{
      if(typeof result==='object'){
        
      }
    })

  }



}
