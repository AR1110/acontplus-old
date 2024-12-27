export interface EmailQueue {
  id: number;
  recipientEmail: string;
  subject: string;
  cc: string;
  body: string;
  isHtml: boolean;
  template: string;
}
