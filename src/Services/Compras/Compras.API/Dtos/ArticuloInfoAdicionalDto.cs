using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.TagHelpers;

namespace Compras.API.Dtos
{
  public record ArticuloInfoAdicionalDto
  {
    public int? IdInfoAdicional { get; set; }

    [Required]
    public int IdArticulo { get; set; }

    [Required]
    public int IdEtiqueta { get; set; }

    [Required]
    public string JsonAdicional { get; set; }
  }
}