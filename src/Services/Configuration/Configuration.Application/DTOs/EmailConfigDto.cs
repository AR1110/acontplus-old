namespace Configuration.Application.DTOs;

public record EmailConfigDto
{
    public bool EnableSsl { get; set; }
    public string From { get; set; } = string.Empty;
    public string Host { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public int Port { get; set; }
}

public record UpdateEmailConfigDto
{
    public bool EnableSsl { get; set; }
    public string From { get; set; } = string.Empty;
    public string Host { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public int Port { get; set; }
}
