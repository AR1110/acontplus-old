namespace Configuration.Application.Dtos;

public record ReportItem
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public string? Query { get; set; }
    public string Code { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public string ReportPath { get; set; } = string.Empty;
    public bool FromMobile { get; set; }
    public bool IsActive { get; set; }
    public bool Enabled { get; set; }
    public DateTime CreatedAt { get; set; }
    public int? CreatedByUserId { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int? UpdatedByUserId { get; set; }
}

public record ReportCreate
{
    public required string Name { get; set; }
    public string? Description { get; set; }
    public string? Query { get; set; }
    public string Code { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public string ReportPath { get; set; } = string.Empty;
    public bool FromMobile { get; set; }
    public bool IsActive { get; set; } = true;
    public bool Enabled { get; set; } = true;
    public int? CreatedByUserId { get; set; }
}

public record ReportUpdate
{
    public required string Name { get; set; }
    public string? Description { get; set; }
    public string? Query { get; set; }
    public string Code { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public string ReportPath { get; set; } = string.Empty;
    public bool FromMobile { get; set; }
    public bool IsActive { get; set; } = true;
    public bool Enabled { get; set; } = true;
    public int? UpdatedByUserId { get; set; }
}
