namespace Configuration.Application.Dtos;

public record EmailConfigDto
{
    public bool EnableSsl { get; set; }
    public string From { get; set; }
    public string Host { get; set; }
    public string Password { get; set; }
    public int Port { get; set; }
}

public record UpdateEmailConfigDto
{
    public bool EnableSsl { get; set; }
    public string From { get; set; }
    public string Host { get; set; }
    public string Password { get; set; }
    public int Port { get; set; }
}
