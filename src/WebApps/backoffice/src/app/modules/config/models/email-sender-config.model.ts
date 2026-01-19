export interface EmailSenderConfig {
  id: number;
  companyId?: number;
  isGlobal: boolean;
  useSsl: boolean;
  senderEmail: string;
  senderName: string;
  smtpServer: string;
  password: string;
  smtpPort: number;
  username: string;
  isActive: boolean;
}
