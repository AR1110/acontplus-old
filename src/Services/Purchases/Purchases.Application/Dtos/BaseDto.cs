using System.ComponentModel.DataAnnotations;

namespace Purchases.Application.Dtos;

public record BaseDto
{
    public int UserRoleId { get; init; }
    public required int SupplierId { get; set; }

    public int? CreditTermId { get; set; }

    public required DateTime IssueDate { get; set; }


    public required decimal TotalExcludingTaxes { get; set; }


    public required decimal DiscountPercentage { get; set; }


    public required decimal TotalAmount { get; set; }

    [MaxLength(300, ErrorMessage = "La observación no puede exceder los 300 caracteres.")]
    public string? Note { get; set; }
    public int? IncomingDocumentId { get; set; }

    public int? EmissionPointId { get; set; }

    public required DateTime DueDate { get; set; }

    public required decimal DiscountAmount { get; set; }

    public int? SubcategoryId { get; set; }
    public decimal Balance { get; init; }
    public decimal AmountPaid { get; init; }
}

