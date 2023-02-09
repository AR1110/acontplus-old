namespace Domain.Dtos
{
    public class ReporteParametroRdlcDto
    {
        public int position { get; set; }
        public string param { get; set; }
        public bool isByte { get; set; }
        public string value { get; set; }
        public byte[] valueByte { get; set; }
        public int total { get; set; }
    }
}