namespace Common.Core.Models;

public class ApiResponse
{
    public string Code { get; set; }
    public string Message { get; set; }
    public dynamic Payload { get; set; }

    public void Create(string code, string message = null, dynamic payload = null)
    {
        Code = code;
        Message = message;
        Payload = payload;
    }
}
