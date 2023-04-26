namespace BL.JwtAuthenticationManger
{
    //public class ExtractCustomHeaderMiddleware
    //{
    //    private readonly RequestDelegate _next;
    //    public ExtractCustomHeaderMiddleware(RequestDelegate next) => _next = next;
    //    public async Task InvokeAsync(HttpContext context)
    //    {
    //        const string HeaderKeyName = "idUsuarioRol";
    //        context.Request.Headers.TryGetValue(HeaderKeyName, out StringValues headerValue);
    //        if (context.Items.ContainsKey(HeaderKeyName))
    //        {
    //            context.Items[HeaderKeyName] = headerValue;
    //        }
    //        else
    //        {
    //            context.Items.Add(HeaderKeyName, $"{headerValue}-received");
    //        }
    //        await _next(context);
    //    }
    //}
}
