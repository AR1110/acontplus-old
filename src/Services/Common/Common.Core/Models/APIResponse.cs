namespace Common.Core.Models
{
    public class ApiResponse
    {
        public string code { get; set; }
        public dynamic data { get; set; }
        public dynamic gestion { get; set; }
        public string id { get; set; }
        public long lastId { get; set; }
        public string message { get; set; }
        public dynamic payload { get; set; }
        public string titleSms { get; set; }
        public string typeNotify { get; set; }
        public void Create(string code, string message = null, dynamic payload = null)
        {
            this.code = code;
            this.data = payload;
            this.id = code;
            this.message = message;
            this.payload = payload;
        }
    }
    public class HelpersResponse
    {
        public string numeroIdentificacion { get; set; }
        public string tipoValidacion { get; set; }
    }
}
