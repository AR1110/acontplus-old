using Domain.Auth.Dtos;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace BL.JwtAuthenticationManger
{
    public class JWTMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IConfiguration _configuration;
        public const string JWT_SECURITY_KEY = "acontplusthebest";

        public JWTMiddleware(RequestDelegate next, IConfiguration configuration)
        {
            _next = next;
            _configuration = configuration;
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
                var key = Encoding.ASCII.GetBytes(JWT_SECURITY_KEY);
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

                //get the user name and role from the JWT token.  
                var username = jwtToken.Claims.First(x => x.Type == "name").Value;
                var idUsuarioRol = jwtToken.Claims.First(x => x.Type == "idUsuarioRol").Value;

                var userClaims = new List<Claim>
                    {
                        new Claim("idRol", idUsuarioRol)
                        //new Claim(ClaimTypes.UserData, Convert.ToString(loginData.userName)),
                        //new Claim(ClaimTypes.NameIdentifier, loginData.userName),
                        //new Claim(ClaimTypes.Name, loginData.fullName),
                        //new Claim(ClaimTypes.Role, loginData.role)
                    };

                //    var userClaims = new List<Claim>()
                //{
                //    new Claim("UserName", username),
                //    new Claim("Role", role)
                // };

                var userIdentity = new ClaimsIdentity(userClaims, "User Identity");

                var userPrincipal = new ClaimsPrincipal(new[] { userIdentity });

                // attach account to context on successful jwt validation   
                var user = new LoginDataDto();
                user.userName = username;
                user.idUsuarioRol = Convert.ToInt32(idUsuarioRol);
                context.Items["User"] = user;

                //context.SignInAsync(userPrincipal, new AuthenticationProperties { IsPersistent = true });
            }
            catch (Exception ex)
            {
                // do nothing if jwt validation fails  
                // account is not attached to context so request won't have access to secure routes  
                throw new Exception(ex.Message);
            }
        }
    }
}
