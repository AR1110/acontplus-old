namespace Common.Core.Models
{
    public class APIResponse
    {
        public string code { get; set; }
        public string message { get; set; }
        public dynamic payload { get; set; }

        public void Create(string code, string message = null, dynamic payload = null)
        {
            this.code = code;
            this.message = message;
            this.payload = payload;
        }
    }
}
