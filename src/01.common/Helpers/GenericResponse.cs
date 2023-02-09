namespace Helpers
{
    public class GenericResponse
    {
        public string code { get; set; }
        public string id { get; set; }
        public string message { get; set; }
        public string titleSms { get; set; }
        public dynamic data { get; set; }
        public dynamic payload { get; set; }
        public void Create(string code, string message = null, string titleSms = null, dynamic payload = null)
        {
            this.code = code;
            this.id = code;
            this.message = message;
            this.titleSms = titleSms;
            this.payload = payload;
            this.data = payload;
        }




        public string typeNotify { get; set; }
        public dynamic gestion { get; set; }
        public long lastId { get; set; }
        public long idTipoDocumento { get; set; }
    }

    public class HelpersResponse
    {
        public string correo { get; set; }
        public string numeroIdentificacion { get; set; }
        public string tipoValidacion { get; set; }
        public decimal abono { get; set; }
        public decimal saldo { get; set; }
        public decimal total { get; set; }
        public decimal posfechado { get; set; }

    }
}