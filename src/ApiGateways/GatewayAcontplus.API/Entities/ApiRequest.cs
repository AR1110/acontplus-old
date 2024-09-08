namespace GatewayAcontplus.API.Entities;
public class ApiRequest
{
    public int Id { get; set; }
    public string Path { get; set; }
    public DateTime Timestamp { get; set; }
    public string DownstreamPath { get; set; }
    public long RequestSize { get; set; }  // Tamaño de la solicitud en bytes
    public long ResponseSize { get; set; }  // Tamaño de la respuesta en bytes
}
