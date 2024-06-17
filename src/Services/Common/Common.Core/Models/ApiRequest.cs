namespace Common.Core.Models;

public class ApiRequest
{
    public int UserRoleId { get; set; }
    public Dictionary<string, object> Data { get; set; }
}
