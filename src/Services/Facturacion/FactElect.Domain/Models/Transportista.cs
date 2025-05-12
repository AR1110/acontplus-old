namespace FactElect.Domain.Models;

public class Transportista
{
    public int idTransportista { get; init; }
    public int idTipoIdentificacion { get; init; }
    public string nroIdentificacion { get; init; }
    public string nombre { get; init; }
    public bool estado { get; init; }
}
