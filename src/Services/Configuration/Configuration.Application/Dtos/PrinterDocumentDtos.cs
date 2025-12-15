namespace Configuration.Application.Dtos;

public record PrinterDocumentCreate
{
    public int PrinterId { get; init; }
    public required string CodDoc { get; init; }
    public int Copies { get; init; }
}

public record PrinterDocumentUpdate
{
    public int PrinterId { get; init; }
    public required string CodDoc { get; init; }
    public int Copies { get; init; }
}

public record PrinterDocumentItem
{
    public int Id { get; init; }
    public int PrinterId { get; init; }
    public string CodDoc { get; init; }
    public int Copies { get; init; }
    public int CreatedByUserId { get; init; }
    public DateTime CreatedDate { get; init; }
    public int? UpdatedByUserId { get; init; }
    public DateTime? UpdatedDate { get; init; }
    public bool IsDeleted { get; init; }
}
