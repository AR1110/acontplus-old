import { Component, inject } from '@angular/core';
import { AtsService } from '@modules/billing/services/ats.service';
import { BreadcrumbComponent } from "@core/components/breadcrumb/breadcrumb.component";
@Component({
  selector: 'app-ats-page',
  standalone: true,
  imports: [
    BreadcrumbComponent
  ],
  templateUrl: './ats-page.component.html',
  styles: ``
})
export class AtsPageComponent {

  atsSvc = inject(AtsService);


  ngOnInit() { }

  function getActualMonth() {
    let actualDate = new Date();
    //$scope.yearSelected = actualDate.getFullYear();
    return actualDate.getMonth() + 1;
  }

  function initialLoad() {
    try {
      mS.getData('get', 'FactElect/Ats/Get', null, true).then(response => {
        years = response[0];
        months = response[1];
        yearSelected = response[0][0];
        for (const element of months) {
          if (getActualMonth() === element.month) {
            monthSelected = element;
          }
        }
        if (getActualMonth() === 6 || getActualMonth() == 12) {
          declarationType()
        }
      })
    } catch (error) {
      console.log(error)
    }

  }
  initialLoad();

  semiannual = false;
  showSemiAnual = false;

  declarationType = function () {
    if (yearSelected.year >= 2020 && (monthSelected.month == 6 || monthSelected.month == 12)) {
      semiannual = false;
      showSemiAnual = true;
      return;
    }
    semiannual = false;
  }

  function getAts() {
    try {
      let json = {
        semianual: semiannual,
        year: Number(yearSelected.year),
        month: Number(monthSelected.month)
      }
      showLoader()
      mS.getFile('get', 'FactElect/Ats/Download?json=' + JSON.stringify(json), null, true).then(response => {
        if (response.id == 0) {
          hideLoader()
          tS.toastr('warning', response.message)
          return;
        }
        if (response.data.size > 0) {
          hideLoader()
          let serverData = new Blob([response.data], { type: response.headers()['content-type'] });
          let fileName = response.headers()['content-disposition'].split(';')[1].split('=')[1];
          FileSaver.saveAs(serverData, fileName);
        }
      }).catch(error => {
        hideLoader()
        console.log(error)
      })
    } catch (error) {
      hideLoader()
      console.log(error)
    }
  }

}
