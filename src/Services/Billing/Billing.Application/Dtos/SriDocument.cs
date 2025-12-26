namespace Billing.Application.Dtos;

public class SriDocument
{
    public string AccessKey { get; set; } = string.Empty;
    public string DocumentType { get; set; } = string.Empty;
    public string IssuerRuc { get; set; } = string.Empty;
    public string IssuerName { get; set; } = string.Empty;
    public string DocumentNumber { get; set; } = string.Empty;
    public DateTime IssueDate { get; set; }
    public decimal TotalAmount { get; set; }
    public string AuthorizationNumber { get; set; } = string.Empty;
    public DateTime? AuthorizationDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public string XmlUrl { get; set; } = string.Empty;
}

public class SriDocumentsResponse
{
    public bool IsSuccess { get; set; }
    public string ErrorMessage { get; set; } = string.Empty;
    public List<SriDocument> Documents { get; set; } = new();
    public int TotalDocuments { get; set; }

    public string? RecaptchaSiteKey { get; set; }
    public string? RecaptchaToken { get; set; }
}
