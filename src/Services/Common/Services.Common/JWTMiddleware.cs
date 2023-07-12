using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace Services.Common
{
    public class JWTMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IConfiguration _configuration;
        private readonly int _tokenLifetime;
        private readonly string _key;
        public JWTMiddleware(RequestDelegate next, IConfiguration configuration)
        {
            _next = next;
            _configuration = configuration;
            _tokenLifetime = Convert.ToInt32(configuration["Token:Exp"]);
            _key = configuration["Token:Key"];
        }

        public async Task Invoke(HttpContext context)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
            if (token != null)
                attachAccountToContext(context, token);

            await _next(context);
        }

        private void attachAccountToContext(HttpContext context, string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(_key);
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    // set clockskew to zero so tokens expire exactly at token expiration time (instead of 5 minutes later)
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;

                // attach account to context on successful jwt validation   
                //var user = new LoginDataDto();
                //user.userName = jwtToken.Claims.First(x => x.Type == "name").Value;
                //user.idUsuarioRol = Convert.ToInt32(jwtToken.Claims.First(x => x.Type == "idUsuarioRol").Value);
                //context.Items["User"] = user;
            }
            catch (Exception ex)
            {
                // do nothing if jwt validation fails
                // account is not attached to context so request won't have access to secure routes
                //context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                //throw new Exception(ex.Message); 
                _ = ex.Message;
            }
        }
    }
}
