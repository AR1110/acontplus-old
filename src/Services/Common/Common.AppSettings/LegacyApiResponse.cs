namespace Common.AppSettings;

public class LegacyApiResponse
{
    public string code { get; set; }
    public dynamic data { get; set; }
    public string id { get; set; }
    public string message { get; set; }
    public dynamic payload { get; set; }
    public string titleSms { get; set; }
    public string typeNotify { get; set; }

    public void Create(string code, string message = null, dynamic payload = null)
    {
        this.code = code;
        data = payload;
        id = code;
        this.message = message;
        this.payload = payload;
    }
}
