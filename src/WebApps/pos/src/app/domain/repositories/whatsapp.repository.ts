
import { Observable } from 'rxjs';
import { WhatsAppMessage } from '../models/whatsapp-message.model';
import { WhatsAppContact } from '../models/whatsapp-contact.model';

export abstract class WhatsappRepository {
  // Mensajería básica
  abstract  sendTextMessage(phoneNumber: string, text: string): Observable<WhatsAppMessage>;

  // Envío de archivos
  abstract  sendImage(phoneNumber: string, imageUrl: string, caption?: string): Observable<WhatsAppMessage>;
  abstract  sendVideo(phoneNumber: string, videoUrl: string, caption?: string): Observable<WhatsAppMessage>;
  abstract  sendDocument(phoneNumber: string, documentUrl: string, filename?: string): Observable<WhatsAppMessage>;
  abstract  sendAudio(phoneNumber: string, audioUrl: string): Observable<WhatsAppMessage>;

  // Ubicación
  abstract  sendLocation(phoneNumber: string, latitude: number, longitude: number): Observable<WhatsAppMessage>;

  // Gestión de contactos y estados
  abstract  getContacts(): Observable<WhatsAppContact[]>;
  abstract  getMessageStatus(messageId: string): Observable<string>;
  abstract  getMessageHistory(chatId: string): Observable<WhatsAppMessage[]>;

  // Notificaciones
  abstract  receiveNotification(): Observable<any>;
  abstract  deleteNotification(receiptId: number): Observable<boolean>;
}
