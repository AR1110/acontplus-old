using System.ComponentModel.DataAnnotations;

namespace Purchases.Application.Dtos
{
    public class ProveedorDto
    {
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
        public required int IdTipoIdentificacion { get; set; }

        public required string NumeroIdentificacion { get; set; }

        public required string NombreFiscal { get; set; }

        [MaxLength(300, ErrorMessage = "El campo {0} debe tener una longitud máxima de {1} caracteres.")]
        public required string NombreComercial { get; set; }

        public required bool SriValidation { get; set; }

        public bool Status { get; set; } = true;
    }
}