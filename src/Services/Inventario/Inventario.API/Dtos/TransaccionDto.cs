namespace Inventario.API.Dtos
{
    public class TransaccionDto
    {
        public string CodTran { get; set; }
        public string CodDoc { get; set; }
        public string DocumentoId { get; set; }
        public int Tipo { get; set; }
    }
}
