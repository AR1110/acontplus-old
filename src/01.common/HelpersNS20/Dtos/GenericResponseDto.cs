namespace HelpersNS20.Dtos
{
    public class GenericResponseDto
    {
        public string code { get; set; }
        public string id { get; set; }
        public string message { get; set; }
        public dynamic payload { get; set; }
        public void shortResponse(string code, string message)
        {
            this.code = code;
            this.id = code;
            this.message = message;
        }
    }
}
