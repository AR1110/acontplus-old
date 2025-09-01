namespace Common.Application.DTOs;

public class WhatsappMessageDto
{
    public string Browser { get; set; }
    public string Os { get; set; }
    public string Emisor { get; set; }
    public string Receptor { get; set; }
    public string Mensaje { get; set; }
    public int TotalMensajes { get; set; }
    public string Params { get; set; }
}
