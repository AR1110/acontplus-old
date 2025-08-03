namespace FactElect.Application.DTOs;

public class SriAuthenticationOptions
{
    public string BaseUrl { get; set; } = "https://srienlinea.sri.gob.ec";
    public string Realm { get; set; } = "Internet";
    public string ClientId { get; set; } = "app-sri-claves-angular";
    public int TimeoutSeconds { get; set; } = 30;
    public string UserAgent { get; set; } = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
}
