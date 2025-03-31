namespace Configuracion.Domain.Models;

public class LegacyApiResponse
{
    public string code { get; set; }
    public dynamic data { get; set; }
    public string id { get; set; }
    public string message { get; set; }
    public string titleSms { get; set; }
    public string typeNotify { get; set; }

    public void Create(string code, string message = null, dynamic data = null)
    {
        this.code = code;
        id = code;
        this.message = message;
        this.data = data;
    }
}
