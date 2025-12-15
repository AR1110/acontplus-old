namespace Billing.Domain.Models;

public class Vehiculo
{
    public int IdVehiculo { get; set; }
    public required string Placa { get; set; }
    public required string Marca { get; set; }
    public required string Modelo { get; set; }
    public required string Observacion { get; set; }
    public bool Estado { get; set; }
}
