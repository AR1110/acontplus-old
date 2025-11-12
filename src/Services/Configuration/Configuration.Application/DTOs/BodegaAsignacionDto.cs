namespace Configuration.Application.DTOs;

public record CreateBodegaAsignacionDto
{
    public int IdBodegAsig { get; set; }
    public string CodEstabAsig { get; set; }
    public int IdBodega { get; set; }
}