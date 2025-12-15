namespace Billing.Domain.Models;

public class Transportista
{
    public int IdTransportista { get; set; }
    public int IdTipoIdentificacion { get; set; }
    public required string NroIdentificacion { get; set; }
    public required string Nombre { get; set; }
    public bool Estado { get; set; }
}
