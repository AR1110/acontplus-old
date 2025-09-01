namespace Common.Application.DTOs;

// DTO for UserReleaseRead endpoint
public record CreateUserReleaseReadDto
{
    public string Releases { get; init; } = string.Empty;
}

// DTO for Notification endpoint
public record CreateNotificationDto
{
    public string CodDoc { get; init; } = string.Empty;
    public string Receptor { get; init; } = string.Empty;
    public string Subject { get; init; } = string.Empty;
    public NotificationParamsDto Params { get; init; } = new();
}

// Nested DTO for Notification params
public record NotificationParamsDto
{
    public NotificationReportParamsDto ReportParams { get; init; } = new();
    public NotificationSpParamsDto SpParams { get; init; } = new();
}

// Nested DTO for Notification report params
public record NotificationReportParamsDto
{
    public string Codigo { get; init; } = string.Empty;
}

// Nested DTO for Notification stored procedure params
public record NotificationSpParamsDto
{
    public int Id { get; init; }
}

// DTO for WhatsApp Message endpoint
public record CreateWhatsAppMessageDto
{
    public string Browser { get; init; } = string.Empty;
    public string Os { get; init; } = string.Empty;
    public string Emisor { get; init; } = string.Empty;
    public string Receptor { get; init; } = string.Empty;
    public string Mensaje { get; init; } = string.Empty;
    public int TotalMensajes { get; init; }
    public string Params { get; init; } = string.Empty;
}

// DTO for User Manual endpoint
public record GetUserManualDto
{
    public int MenuId { get; init; }
    public string TextSearch { get; init; } = string.Empty;
    public int PageIndex { get; init; }
    public int PageSize { get; init; }
}
