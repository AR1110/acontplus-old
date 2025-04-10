
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {envConfig} from "@/config/env.config";
import {customUrl} from "acontplus-utils";

@Injectable({
  providedIn: 'root'
})
export class GreenApiService {
  private apiUrl = envConfig.greenApi.url;
  private idInstance = envConfig.greenApi.idInstance;
  private apiTokenInstance = envConfig.greenApi.apiTokenInstance;

  constructor(private http: HttpClient) {}

  // Endpoint base
  private getEndpoint(method: string): string {
    return `${this.apiUrl}/waInstance${this.idInstance}/${method}/${this.apiTokenInstance}`;
  }

  // Enviar texto
  sendTextMessage(phone: string, message: string): Observable<any> {
    const url = this.getEndpoint('sendMessage');
    const body = {
      chatId: `${phone}@c.us`,
      message
    };

    return this.http.post(url, body, {
      context: customUrl(),
    },).pipe(
      catchError(this.handleError)
    );
  }

  // Enviar imagen
  sendImage(phone: string, urlFile: string, caption?: string): Observable<any> {
    const url = this.getEndpoint('sendFileByUrl');
    const body = {
      chatId: `${phone}@c.us`,
      urlFile,
      caption,
      fileName: caption || 'image'
    };

    return this.http.post(url, body, {
      context: customUrl(),
    },).pipe(
      catchError(this.handleError)
    );
  }

  // Enviar video
  sendVideo(phone: string, urlFile: string, caption?: string): Observable<any> {
    const url = this.getEndpoint('sendFileByUrl');
    const body = {
      chatId: `${phone}@c.us`,
      urlFile,
      caption,
      fileName: caption || 'video'
    };

    return this.http.post(url, body, {
      context: customUrl(),
    },).pipe(
      catchError(this.handleError)
    );
  }

  // Enviar documento
  sendDocument(phone: string, urlFile: string, filename?: string): Observable<any> {
    const url = this.getEndpoint('sendFileByUrl');
    const body = {
      chatId: `${phone}@c.us`,
      urlFile,
      fileName: filename || 'document'
    };

    return this.http.post(url, body, {
      context: customUrl(),
    },).pipe(
      catchError(this.handleError)
    );
  }

  // Enviar audio
  sendAudio(phone: string, urlFile: string): Observable<any> {
    const url = this.getEndpoint('sendFileByUrl');
    const body = {
      chatId: `${phone}@c.us`,
      urlFile,
      fileName: 'audio'
    };

    return this.http.post(url, body, {
      context: customUrl(),
    },).pipe(
      catchError(this.handleError)
    );
  }

  // Enviar ubicación
  sendLocation(phone: string, latitude: number, longitude: number): Observable<any> {
    const url = this.getEndpoint('sendLocation');
    const body = {
      chatId: `${phone}@c.us`,
      latitude,
      longitude
    };

    return this.http.post(url, body, {
      context: customUrl(),
    },).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener contactos
  getContacts(): Observable<any> {
    const url = this.getEndpoint('getContacts');
    return this.http.get(url, {
      context: customUrl(),
    },).pipe(
      catchError(this.handleError)
    );
  }

  // Estado del mensaje
  getMessageStatus(messageId: string, chatId: string): Observable<any> {
    const url = this.getEndpoint('getMessageStatus');
    const params = { messageId, chatId };

    return this.http.get(url, { params,
    context: customUrl()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Historial de chat
  getChatHistory(chatId: string): Observable<any> {
    const url = this.getEndpoint('getChatHistory');
    const params = { chatId };

    return this.http.get(url, { params,
      context: customUrl()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Recibir notificaciones
  receiveNotification(): Observable<any> {
    const url = this.getEndpoint('receiveNotification');

    return this.http.get(url, {
      context: customUrl()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar notificación
  deleteNotification(receiptId: number): Observable<any> {
    const url = this.getEndpoint('deleteNotification');
    const params = { receiptId };

    return this.http.delete(url, { params,
      context: customUrl()
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('Green API error:', error);
    return throwError(() => new Error(`Green API error: ${error.message}`));
  }
}
