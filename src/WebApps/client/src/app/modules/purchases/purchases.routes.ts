import {Route} from "@angular/router";

export const routes: Route[] = [
  {
    path: "received-document",
    title: 'Documento Recibido',
    loadComponent: () =>
      import('@purchases/ui/received-document/received-document').then(
        (m) => m.ReceivedDocument,
      ),
    data: {
      breadcrumb: 'Documento Recibido',
    },
  }
]
