import { SafeHtml } from '@angular/platform-browser';

export interface UserManual {
  id: number;
  title: string;
  content: string;
  safeEmbedCode?: SafeHtml;
  totalRecords?: number;
}
