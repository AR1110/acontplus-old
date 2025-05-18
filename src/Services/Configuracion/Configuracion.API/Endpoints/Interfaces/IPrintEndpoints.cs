namespace Configuracion.API.Endpoints.Interfaces;

public interface IPrintEndpoints
{
    Task<IResult> Print(string json);
}