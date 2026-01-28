namespace Configuration.Application.Dtos;

public record EmailSenderConfigCreate(
    int CompanyId,
    bool IsGlobal,
    string SenderEmail,
    string? SenderName,
    string SmtpServer,
    int SmtpPort,
    bool UseSsl,
    string Username,
    string Password
);

public record EmailSenderConfigUpdate(
    int CompanyId,
    bool IsGlobal,
    string SenderEmail,
    string? SenderName,
    string SmtpServer,
    int SmtpPort,
    bool UseSsl,
    string Username,
    string Password
);

public record EmailSenderConfigItem(
    int Id,
    int CompanyId,
    bool IsGlobal,
    string SenderEmail,
    string? SenderName,
    string SmtpServer,
    int SmtpPort,
    bool UseSsl,
    string Username,
    string? PasswordHash,
    int CreatedByUserId,
    int UpdatedByUserId
);