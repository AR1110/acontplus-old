using System.Net;

namespace FactElect.Application.Models;

public class CookieResponse
{
    public CookieContainer Cookie { get; set; }
    public string Html { get; set; }
}
