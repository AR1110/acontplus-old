namespace Configuration.Application.DTOs;

public record CreatePtoEmiAsigDto
{
    public string CodEstab_Asig { get; set; }

    [MaxLength(5)]
    public int? IdPuntoEmision { get; set; }

    [MaxLength(5)]
    public int? IdPtoEmi_Asig { get; set; }
}
