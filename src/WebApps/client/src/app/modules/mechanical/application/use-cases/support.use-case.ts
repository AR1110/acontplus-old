import { Injectable } from '@angular/core';
import { SupportRepository } from '@mechanical/domain/repositories/support.repository';

@Injectable({
  providedIn: 'root',
})
export class SupportUseCase {
  constructor(private repo: SupportRepository) {}

  getAll<T extends { pageIndex: number; pageSize: number }>(obj: T) {
    return this.repo.getAll(obj);
  }

  getDataForm() {
    return this.repo.getDataForm();
  }

  getId(id: number, loader?: boolean) {
    return this.repo.getId(id, loader);
  }

  getDashboard() {
    return this.repo.getDashboard();
  }

  getConvertToAprobDoc(id: number, loader?: boolean) {
    return this.repo.getConvertToAprobDoc(id, loader);
  }

  getDocView(id: number, loader?: boolean) {
    return this.repo.getDocView(id, loader);
  }

  generateSequential(idPuntoEmision: number) {
    return this.repo.generateSequential(idPuntoEmision);
  }

  search<T extends { textSearch: string }>(obj: T) {
    return this.repo.search(obj);
  }

  post<T>(data: T) {
    return this.repo.post(data);
  }

  put<T>(id: number, data: T) {
    return this.repo.put(id, data);
  }

  remove(id: number) {
    return this.repo.remove(id);
  }

  putState(id: number, supportStatusId: number) {
    return this.repo.putState(id, supportStatusId);
  }
}
