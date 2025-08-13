using System.ComponentModel.DataAnnotations;

namespace Compras.API.Dtos
{
  public class ProveedorDto
  {
    public int? Id { get; set; }
    public int? IdCiudad { get; set; }
    public int? IdTipoClienteProveedor { get; set; }
    public int? IdTipoEntidad { get; set; }
    public int? IdSubContribuyente { get; set; }
    public int? IdTiempoCredito { get; set; }

    [MaxLength(300)]
    public string? Direccion { get; set; }

    [MaxLength(300)]
    public string? Telefono { get; set; }

    [MaxLength(300)]
    public string? Correo { get; set; }

    // Campos NOT NULL
    public required int IdTypeId { get; set; }

    public required string IdCard { get; set; }

    public required string BusinessName { get; set; }

    [MaxLength(300, ErrorMessage = "El campo {0} debe tener una longitud máxima de {1} caracteres.")]
    public required string TradeName { get; set; }

    public required bool SriValidation { get; set; }

    public bool Status { get; set; } = true;
  }
}