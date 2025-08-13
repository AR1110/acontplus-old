namespace Compras.API.Dtos
{
  public record CompraNoHabitualDto
  {
    public DocumentIngresoDto DocumentIngreso { get; set; }

    public List<ArticuloInfoAdicionalDto> ArticulosInfoAdicional { get; set; }

    public List<TaxDto> Impuestos { get; set; }

    public ArticuloInfoAdicionalDto ArticuloInfoAdicional { get; set; }

    public List<CuotaDto> Cuotas { get; set; }
  }
}