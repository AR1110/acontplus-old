export type WhatsAppMessageType = 'text' | 'image' | 'video' | 'document' | 'audio' | 'location';

export interface WhatsAppMessage {
  id?: string;
  chatId: string;
  type: WhatsAppMessageType;
  content: string;
  caption?: string;
  filename?: string;
  mimeType?: string;
  timestamp?: Date;
  status?: 'queue' | 'sent' | 'delivered' | 'read';
}
