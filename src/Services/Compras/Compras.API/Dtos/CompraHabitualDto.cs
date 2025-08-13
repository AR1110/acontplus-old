using System.ComponentModel.DataAnnotations;

namespace Compras.API.Dtos
{
  public record CompraHabitualDto
  {
    public int IdProveedor { get; set; }

    [StringLength(14)]
    [Required(ErrorMessage = "El RUC es obligatorio.")]
    public string Ruc { get; set; }
    public int IdArticulo { get; set; }

    [StringLength(100)]
    [Required(ErrorMessage = "El código artículo es obligatorio.")]
    public string Codigo { get; set; }
  }
}