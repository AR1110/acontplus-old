import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

type ToastrProps = {
  type: "success" | "warning" | "info" | "error"
  message: string
  title?: string
}

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor(private tS: ToastrService) { }

  toastr(props: ToastrProps) {
    const {type, message, title} = props
    const options = {
      closeButton: true,
      newestOnTop: true,
      progressBar: true,
      positionClass: 'toast-bottom-center',
      timeOut: 5000,
      extendedTimeOut: 1000, 
    }
    if (type === "success") {
      this.tS.success(message, title, options)
    }
    if (type === "warning") {
      this.tS.warning(message, title, options)
    }
    if (type === "info") {
      this.tS.info(message, title, options)
    }
    if (type === "error") {
      this.tS.error(message, title, options)
    }
  }


}
