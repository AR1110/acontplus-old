namespace Billing.Application.Dtos;

public class SriDocumentsRequest
{
  public required string Username { get; set; }
  public required string Password { get; set; }
  public string? AdditionalCi { get; set; }

  // Query parameters
  public int Year { get; set; } = DateTime.Now.Year;
  public int Month { get; set; } = DateTime.Now.Month;
  public int Day { get; set; } = 0; // 0 = All days
  public SriDocumentType DocumentType { get; set; } = SriDocumentType.Invoice;
  public string? RecaptchaToken { get; set; }

  // Optional: Reuse an existing authenticated browser session
  public Dictionary<string, string>? Cookies { get; set; }

  // Optional: Use browser automation (Playwright) to execute JSF/reCAPTCHA flows
  public bool UseBrowserAutomation { get; set; } = false;
  public bool BrowserAutomationHeadless { get; set; } = true;
  public int BrowserAutomationTimeoutSeconds { get; set; } = 180;

  // Optional: automatically solve reCAPTCHA using configured solver
  public bool UseRecaptchaSolver { get; set; } = false;

  // Optional: include reCAPTCHA debug values in the response
  public bool CaptureRecaptchaValues { get; set; } = false;
}

public enum SriDocumentType
{
  Invoice = 1,                        // Factura
  PurchaseSettlement = 2,             // Liquidación de compra
  CreditNote = 3,                     // Nota de Crédito
  DebitNote = 4,                      // Nota de Débito
  WithholdingReceipt = 6              // Comprobante de Retención
}
