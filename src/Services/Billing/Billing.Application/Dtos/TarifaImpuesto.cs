namespace Billing.Application.Dtos;

public class TarifaImpuesto
{
    public int IdTarifaImpuesto { get; set; }
    public required string CodImpuesto { get; set; }
    public required string Codigo { get; set; }
    public required string Descripcion { get; set; }
    public double Porcentaje { get; set; }
}
