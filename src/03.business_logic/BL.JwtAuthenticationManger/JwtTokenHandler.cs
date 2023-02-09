using Domain.Auth.Models;
using Domain.ViewModels;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BL.JwtAuthenticationManger
{
    public class JwtTokenHandler
    {
        public const string JWT_SECURITY_KEY = "acontplusthebest";
        private const int JWT_TOKEN_VALIDITY_MINS = 20;
        public List<Usuario> _users;
        public JwtTokenHandler()
        {
            _users = new List<Usuario>
            {
                new Usuario{userName="ipaz", password="123456", role="admin"},
                new Usuario{userName="aramirez", password="123456", role="Administrator"}
            };
        }
        public AuthResponse? GenerateJwtToken(LoginData authRequest)
        {
            try
            {
                //if (string.IsNullOrWhiteSpace(authRequest.userName) || string.IsNullOrWhiteSpace(authRequest.password))
                //{
                //    return null;
                //}
                //var user = _users.Where(x => x.userName == authRequest.userName && x.password == authRequest.password).FirstOrDefault();
                //if (user == null) return null;

                var tokenExpiryTimeStamp = DateTime.Now.AddMinutes(JWT_TOKEN_VALIDITY_MINS);
                var tokenKey = Encoding.ASCII.GetBytes(JWT_SECURITY_KEY);
                var claimsIdentiy = new ClaimsIdentity(new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Name, authRequest.userName),
                //new Claim("Role", authRequest.role),
                    new Claim("idRol", Convert.ToString(authRequest.idRol)),
                        new Claim(ClaimTypes.UserData, Convert.ToString(authRequest.userName)),
                        new Claim(ClaimTypes.NameIdentifier, authRequest.userName),
                        new Claim(ClaimTypes.Name, authRequest.fullName),
                        new Claim(ClaimTypes.Role, authRequest.role)

            });
                var signingCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(tokenKey),
                    SecurityAlgorithms.HmacSha256Signature
                    );

                var date = DateTime.UtcNow;

                var securityTokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = claimsIdentiy,
                    Expires = date.AddMinutes(JWT_TOKEN_VALIDITY_MINS),
                    SigningCredentials = signingCredentials
                };
                var jwtSecurityTokenHandler = new JwtSecurityTokenHandler();
                var securityToken = jwtSecurityTokenHandler.CreateToken(securityTokenDescriptor);
                var token = jwtSecurityTokenHandler.WriteToken(securityToken);
                return new AuthResponse
                {
                    userName = authRequest.userName,
                    expiresIn = (int)tokenExpiryTimeStamp.Subtract(DateTime.Now).TotalSeconds,
                    jwtToken = token
                };
            }
            catch (Exception ex)
            {
                _ = ex.Message;
                return null;
            }
        }
    }
}
