namespace Lib.Common.Api
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
            id = code;
            this.message = message;
            this.titleSms = titleSms;
            this.payload = payload;
            data = payload;
        }
        public string typeNotify { get; set; }
        public dynamic gestion { get; set; }
        public long lastId { get; set; }
    }

    public class HelpersResponse
    {
        public string numeroIdentificacion { get; set; }
        public string tipoValidacion { get; set; }

    }
}
