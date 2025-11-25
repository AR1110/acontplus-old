namespace Configuration.Application.Dtos;

public record CreatePtoEmisionDto
{
    public string CodEstab { get; set; }
    public string Ambiente { get; set; }
    public string PtoEmi { get; set; }
}

public record UpdatePtoEmisionDto
{
    public string Ambiente { get; set; }
    public string PtoEmi { get; set; }
    public bool Estado { get; set; }
}