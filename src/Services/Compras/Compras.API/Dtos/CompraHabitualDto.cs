using System.ComponentModel.DataAnnotations;

namespace Compras.API.Dtos
{
  public record CompraHabitualDto
  {
    public int? IdProveedor { get; set; }

    [StringLength(14)]
    public required string Ruc { get; set; }

    public int? IdArticulo { get; set; }

    [StringLength(100)]
    public required string CodigoArticulo { get; set; }
  }
}