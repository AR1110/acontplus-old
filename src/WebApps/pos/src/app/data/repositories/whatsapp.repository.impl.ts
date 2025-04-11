
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import {WhatsappRepository} from "@domain/repositories/whatsapp.repository";
import {GreenApiService} from "@data/api/green-api/green-api.service";
import {WhatsAppMessage} from "@domain/models/whatsapp-message.model";
import {WhatsAppContact} from "@domain/models/whatsapp-contact.model";

@Injectable({
  providedIn: 'root'
})
export class WhatsappRepositoryImpl implements WhatsappRepository {
  constructor(private greenApiService: GreenApiService) {}

  sendTextMessage(phoneNumber: string, text: string): Observable<WhatsAppMessage> {
    return this.greenApiService.sendTextMessage(phoneNumber, text).pipe(
      map(response => ({
        id: response.idMessage,
        chatId: `${phoneNumber}@c.us`,
        type: 'text',
        content: text,
        timestamp: new Date(),
        status: 'queue'
      }))
    );
  }

  sendImage(phoneNumber: string, imageUrl: string, caption?: string): Observable<WhatsAppMessage> {
    return this.greenApiService.sendImage(phoneNumber, imageUrl, caption).pipe(
      map(response => ({
        id: response.idMessage,
        chatId: `${phoneNumber}@c.us`,
        type: 'image',
        content: imageUrl,
        caption: caption,
        timestamp: new Date(),
        status: 'queue'
      }))
    );
  }

  sendVideo(phoneNumber: string, videoUrl: string, caption?: string): Observable<WhatsAppMessage> {
    return this.greenApiService.sendVideo(phoneNumber, videoUrl, caption).pipe(
      map(response => ({
        id: response.idMessage,
        chatId: `${phoneNumber}@c.us`,
        type: 'video',
        content: videoUrl,
        caption: caption,
        timestamp: new Date(),
        status: 'queue'
      }))
    );
  }

  sendDocument(phoneNumber: string, documentUrl: string, filename?: string): Observable<WhatsAppMessage> {
    return this.greenApiService.sendDocument(phoneNumber, documentUrl, filename).pipe(
      map(response => ({
        id: response.idMessage,
        chatId: `${phoneNumber}@c.us`,
        type: 'document',
        content: documentUrl,
        filename: filename,
        timestamp: new Date(),
        status: 'queue'
      }))
    );
  }

  sendAudio(phoneNumber: string, audioUrl: string): Observable<WhatsAppMessage> {
    return this.greenApiService.sendAudio(phoneNumber, audioUrl).pipe(
      map(response => ({
        id: response.idMessage,
        chatId: `${phoneNumber}@c.us`,
        type: 'audio',
        content: audioUrl,
        timestamp: new Date(),
        status: 'queue'
      }))
    );
  }

  sendLocation(phoneNumber: string, latitude: number, longitude: number): Observable<WhatsAppMessage> {
    return this.greenApiService.sendLocation(phoneNumber, latitude, longitude).pipe(
      map(response => ({
        id: response.idMessage,
        chatId: `${phoneNumber}@c.us`,
        type: 'location',
        content: `${latitude},${longitude}`,
        timestamp: new Date(),
        status: 'queue'
      }))
    );
  }

  getContacts(): Observable<WhatsAppContact[]> {
    return this.greenApiService.getContacts().pipe(
      map(response => response.map((contact: any) => ({
        phoneNumber: contact.id.replace('@c.us', ''),
        name: contact.name || '',
        avatar: contact.avatar || ''
      })))
    );
  }

  getMessageStatus(messageId: string): Observable<string> {
    // Necesitamos el chatId, que normalmente debería estar asociado con el messageId en alguna parte
    // Por simplicidad, aquí asumimos que lo tenemos
    const chatId = this.getChatIdForMessage(messageId);

    return this.greenApiService.getMessageStatus(messageId, chatId).pipe(
      map(response => response.status)
    );
  }

  getMessageHistory(chatId: string): Observable<WhatsAppMessage[]> {
    return this.greenApiService.getChatHistory(chatId).pipe(
      map(response => this.mapToWhatsAppMessages(response))
    );
  }

  receiveNotification(): Observable<any> {
    return this.greenApiService.receiveNotification();
  }

  deleteNotification(receiptId: number): Observable<boolean> {
    return this.greenApiService.deleteNotification(receiptId).pipe(
      map(() => true)
    );
  }

  // Método auxiliar que en una implementación real obtendría el chatId
  // asociado con un messageId específico
  private getChatIdForMessage(messageId: string): string {
    // En una implementación real, esto podría consultar una base de datos local
    // o algún otro almacenamiento
    return '123456789@c.us'; // Ejemplo
  }

  private mapToWhatsAppMessages(response: any[]): WhatsAppMessage[] {
    return response.map(item => {
      const base = {
        id: item.idMessage,
        chatId: item.chatId,
        timestamp: new Date(item.timestamp * 1000),
        status: item.status
      };

      // Determinar tipo de mensaje
      if (item.type === 'textMessage') {
        return {
          ...base,
          type: 'text',
          content: item.textMessage
        };
      } else if (item.type === 'imageMessage') {
        return {
          ...base,
          type: 'image',
          content: item.fileUrl,
          caption: item.caption
        };
      } else if (item.type === 'videoMessage') {
        return {
          ...base,
          type: 'video',
          content: item.fileUrl,
          caption: item.caption
        };
      }
      // ... manejo de otros tipos de mensajes

      return {
        ...base,
        type: 'text',
        content: 'Mensaje desconocido'
      };
    });
  }
}
