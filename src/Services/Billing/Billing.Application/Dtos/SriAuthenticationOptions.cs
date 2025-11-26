namespace Billing.Application.Dtos;

public class SriAuthenticationOptions
{
    public string BaseUrl { get; set; } = "https://srienlinea.sri.gob.ec";
    public string Realm { get; set; } = "Internet";
    public string ClientId { get; set; } = "app-sri-claves-angular";
    public string RedirectUri { get; set; } = "https://srienlinea.sri.gob.ec/sri-en-linea/contribuyente/perfil";
    public int TimeoutSeconds { get; set; } = 30;
}
