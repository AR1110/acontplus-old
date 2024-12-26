
import { Observable } from "rxjs";
import {StateInstanceGreenApiResponse} from "@domain/models/api-green.model";

export abstract class ApiGreenRepository {
  abstract getStateInstance(): Observable<StateInstanceGreenApiResponse>;
  abstract sendSMS(chatId: string, message: string): Observable<StateInstanceGreenApiResponse>;
  abstract sendFileByUpload<T extends { caption: string, chatId: string, file: File }>(obj: T): Observable<StateInstanceGreenApiResponse>;
}
