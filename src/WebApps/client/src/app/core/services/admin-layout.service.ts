import { computed, inject, Injectable, signal } from '@angular/core';
import { DocumentoElectronicoUseCase } from '@billing/domain/use-cases/documento-electronico.use-case';
import { forkJoin } from 'rxjs';
import { DashboardListUseCase } from '@modules/common/core/use-cases/dashboard-list.use-case';

@Injectable({
  providedIn: 'root',
})
export class AdminLayoutService {
  private docElectUseCase = inject(DocumentoElectronicoUseCase);
  private dashboardListUseCase = inject(DashboardListUseCase);

  private statistics = signal({
    itemCount: 0,
    customerCount: 0,
    supplierCount: 0,
    userCount: 0,
  });
  licenses = signal([]);
  stepsConfig = signal([]);
  expiredSignatures = signal([]);
  emittedDocuments = signal<any>([]);
  receivedDocuments = signal([]);
  anotherSalesDocs = signal([]);

  notifications = signal<any[]>([]);

  getStatistics = computed(() => {
    return this.statistics();
  });

  getNotifications = computed(() => {
    return this.notifications();
  });

  loadDashboardData() {
    forkJoin({
      dashboard: this.dashboardListUseCase.execute({}),
      documents: this.docElectUseCase.getAll({
        codEstado: 8,
      }),
    }).subscribe((response) => {
      const { dashboard, documents } = response;
      const { data } = documents;
      const {
        statistics,
        licenses,
        stepsConfig,
        expiredSignatures,
        emittedDocuments,
        receivedDocuments,
        anotherSalesDocs,
      } = dashboard;

      this.statistics.set(statistics);
      this.licenses.set(licenses);
      this.stepsConfig.set(stepsConfig);
      this.expiredSignatures.set(expiredSignatures);
      this.emittedDocuments.set(emittedDocuments);
      this.receivedDocuments.set(receivedDocuments);
      this.anotherSalesDocs.set(anotherSalesDocs);
      console.log(response);

      const pendingDocs = data.length;
      const notifications = structuredClone(this.notifications());

      const documentNotification = {
        id: '1',
        title: 'Documentos Electrónicos',
        message:
          pendingDocs === 1
            ? '1 documento sin autorizar'
            : `${pendingDocs} documentos sin autorizar`,
        type: 'info',
        icon: 'description',
      };
      if (pendingDocs > 0) {
        notifications.unshift(documentNotification);
      }

      this.notifications.set(notifications);
    });
  }
}
