namespace Common.Application.Dtos;

// DTO for UserReleaseRead endpoint
public record CreateUserReleaseReadDto
{
    public string Releases { get; init; }
}

// DTO for Notification endpoint
public record CreateNotificationDto
{
    public string CodDoc { get; init; }
    public string Receptor { get; init; }
    public string Subject { get; init; }
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
    public string Codigo { get; init; }
}

// Nested DTO for Notification stored procedure params
public record NotificationSpParamsDto
{
    public int Id { get; init; }
}

// DTO for WhatsApp Message endpoint
public record CreateWhatsAppMessageDto
{
    public string Browser { get; init; }
    public string Os { get; init; }
    public string Emisor { get; init; }
    public string Receptor { get; init; }
    public string Mensaje { get; init; }
    public int TotalMensajes { get; init; }
    public string Params { get; init; }
}

// DTO for User Manual endpoint
public record GetUserManualDto
{
    public int MenuId { get; init; }
    public string TextSearch { get; init; }
    public int PageIndex { get; init; }
    public int PageSize { get; init; }
}
