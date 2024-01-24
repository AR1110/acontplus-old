import { Directive, ElementRef, Input, OnInit, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';
import { NgbTypeaheadConfig } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { SupplierService } from '../services/supplier.service';

@Directive({
  selector: '[appSupplierSearchDrtv]',
  exportAs: 'appSupplierSearchDrtv',
  standalone: true
})
export class SupplierSearchDirective implements OnInit {
  @Input() onSelect: any;
  @Input() onKeyup: any;
  @Input() ngModel: any;
  @Input() isReturnData: boolean = false;
  @Input() resultTemplate!: TemplateRef<any>;

  private searchSubject = new Subject<string>();
  //private elementRef!: ElementRef<HTMLInputElement>;

  constructor(
    private renderer: Renderer2,
    private supplierSvc: SupplierService,
    private config: NgbTypeaheadConfig,
    private viewContainer: ViewContainerRef,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.config.showHint = true; // Ajusta NgbTypeaheadConfig según tus necesidades

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.search(term))
    ).subscribe(results => {
      console.log(results);
      this.updateResults(results);
    });

    // Vincula el ngModel a la entrada
    this.renderer.setProperty(this.elementRef.nativeElement, 'value', this.ngModel);

    // Wire up the typeahead events
    this.renderer.listen(this.elementRef.nativeElement, 'input', (event: any) => {
      this.searchSubject.next(event.target.value);
    });

    this.renderer.listen(this.elementRef.nativeElement, 'selectItem', (event: any) => {
      this.onSelectProveedor(event.detail);
    });
  }

  search(textSearch: string): Observable<any[]> {
    if (textSearch.length > 1) {
      console.log(textSearch);
      return this.supplierSvc.search({ textSearch });
    }

    return new Observable<any[]>(observer => {
      observer.next([]);
    });
  }

  onSelectProveedor(data: any): void {
    if (this.isReturnData) {
      // Agrega manejo de loader
      // this.supplierSvc.getId(data.idProveedor).toPromise()
      //   .then(response => {
      //     this.onSelect({ result: response });
      //   })
      //   .catch(error => {
      //     console.log(error);
      //   })
      //   .finally(() => {
      //   });
      // return;
    }
    this.onSelect({ result: data });
  }

  private updateResults(results: any[]): void {
    this.viewContainer.clear();
    results.forEach(result => {
      const context = { $implicit: result, term: this.ngModel };
      this.viewContainer.createEmbeddedView(this.resultTemplate, context);
    });
  }
}
