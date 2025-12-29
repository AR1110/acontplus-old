using System.ComponentModel.DataAnnotations;

namespace Purchases.Application.Dtos
{
    public record ReceivedDocumentReceiptDto
    {
        [MaxLength(50)]
        public required string DocumentType { get; set; }

        [MaxLength(50)]
        public required string DocumentSeries { get; set; }

        [MaxLength(15)]
        public required string IssuerTaxId { get; set; }

        [MaxLength(50)]
        public required string IssuerBusinessName { get; set; }

        public required string IssueDate { get; set; }

        public required string AuthorizationDate { get; set; }

        [MaxLength(15)]
        public required string ReceiverTaxId { get; set; }

        [MaxLength(50)]
        public required string AccessKey { get; set; }

        [MaxLength(50)]
        public required string AuthorizationNumber { get; set; }

        public required string TotalAmount { get; set; }
    }
}
