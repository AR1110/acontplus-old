import { Injectable } from '@angular/core';
import {ApiGreenRepository} from "@domain/repositories/api-green.repository";

@Injectable({
  providedIn: 'root'
})
export class ApiGreenUseCase {
  constructor(
    private repo: ApiGreenRepository,
  ) {}

   getStateInstance(){
    return this.repo.getStateInstance();
   }
   sendSMS(chatId: string, message: string){
    return this.repo.sendSMS(chatId, message);
   }
   sendFileByUpload<T extends { caption: string, chatId: string, file: File }>(obj: T) {
    return this.repo.sendFileByUpload(obj)
   }
}
