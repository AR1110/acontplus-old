using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.TagHelpers;

namespace Compras.API.Dtos
{
  public record ArticuloInfoAdicionalDto
  {
    public int? IdInfoAdicional { get; set; }

    public required int IdArticulo { get; set; }

    public required int IdEtiqueta { get; set; }

    public required string JsonAdicional { get; set; }
  }
}