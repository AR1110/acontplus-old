namespace GatewayAcontplus.API.Delegates;
public class ConnectionStringHeaderDelegatingHandler : DelegatingHandler
{
    private readonly IConfiguration _configuration;

    public ConnectionStringHeaderDelegatingHandler(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        var connectionString = _configuration.GetConnectionString("DefaultConnection");

        request.Headers.Add("X-CONN-STR", connectionString);
        return await base.SendAsync(request, cancellationToken);
    }
}
