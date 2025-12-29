namespace Purchases.Application.Dtos
{
    public record DetailBaseDto
    {
        public required int ArticleId { get; set; }

        public required int WarehouseId { get; set; }

        public int? UnitId { get; set; }

        public required int VatTypeId { get; set; }


        public required decimal Ice { get; set; }


        public required decimal Quantity { get; set; }


        public required decimal UnitPrice { get; set; }


        public required decimal DiscountPercentage { get; set; }

        public required string PercentageCode { get; set; }


        public required decimal Rate { get; set; }


        public required decimal TaxAmount { get; set; }


        public required decimal TotalPriceExcludingTax { get; set; }

        public string? Note { get; set; }

        public required string Description { get; set; }


        public decimal? DiscountValue { get; set; }


        public decimal? DiscountAmount { get; set; }

        public bool? IsActive { get; set; } = true;
    }
}
