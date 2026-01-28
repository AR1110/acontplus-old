namespace Billing.Application.Dtos;

public class ActividadEconomica
{
    public int IdActividadEconomica { get; set; }
    public required string Codigo { get; set; }
    public required string CodTarifaImpuesto { get; set; }
    public int IdTarifaImpuesto { get; set; }
    public decimal Porcentaje { get; set; }
    public required string Descripcion { get; set; }
    public required string CodGrupo { get; set; }
    public required string Grupo { get; set; }
    public int IdGrupoActividad { get; set; }
    public bool Estado { get; set; }
}