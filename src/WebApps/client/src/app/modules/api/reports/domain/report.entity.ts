
export interface ReportParams<T = unknown> {
  data: T;
  format?: string;
  isOldVersion?: boolean;
  downloadOnly?: boolean;
  openInModal?: boolean;
}
