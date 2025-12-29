using System.ComponentModel.DataAnnotations;

namespace Purchases.Application.Dtos
{
    public record InvoiceReceiptDto : BaseDto
    {
        public required int PurchaseInvoiceId { get; set; }
        public required int TaxSupportId { get; set; }

        public required int EstablishmentId { get; set; }

        [MaxLength(50)]
        public required string EmissionPoint { get; set; }

        [MaxLength(50)]
        public required string AuthorizationNumber { get; set; }

        [MaxLength(100)]
        public required string DocumentCode { get; set; }

        public required decimal SubtotalExcludingTaxes { get; set; }


        public required decimal TotalDiscount { get; set; }


        public required decimal Tip { get; set; }


        public required decimal Surcharge { get; set; }


        public required decimal Freight { get; set; }


        public required decimal Total { get; set; }

        public required int? SubcategoryId { get; set; }

    }
}
