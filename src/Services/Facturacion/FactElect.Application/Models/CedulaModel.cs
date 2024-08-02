namespace FactElect.Application.Models;

public class CedulaModel
{
    public string identificacion { get; set; }
    public string nombreCompleto { get; set; }
    public object fechaDefuncion { get; set; }
    public string Error { get; set; }
    public bool NetworkError { get; set; }
    public string direccion { get; set; }
    public string email { get; set; }
    public string telefono { get; set; }
}
