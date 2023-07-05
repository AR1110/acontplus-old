using Domain.Auth.Dtos;
using Domain.Auth.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BL.JwtAuthenticationManger
{
    public class JwtTokenHandler
    {
        public const string JWT_SECURITY_KEY = "10dgytXep4Y9vMtYwEZGjYvJwjJ8QG5FTyKn6eEftik=";
        private const int JWT_TOKEN_VALIDITY_MINS = 840;
        public AuthResponse? GenerateJwtToken(LoginDataDto authRequest)
        {
            var tokenKey = Encoding.ASCII.GetBytes(JWT_SECURITY_KEY);
            var signingCredentials = new SigningCredentials(new SymmetricSecurityKey(tokenKey), SecurityAlgorithms.HmacSha256Signature);
            var claimsIdentiy = new ClaimsIdentity(new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Name, authRequest.fullName),
                    new Claim(JwtRegisteredClaimNames.GivenName, authRequest.fullName),
                    new Claim(JwtRegisteredClaimNames.UniqueName, authRequest.userName),
                    new Claim(ClaimTypes.Role, authRequest.role),
                    new Claim("idUsuarioRol", Convert.ToString(authRequest.idUsuarioRol)),
                    new Claim("userRoleId", Convert.ToString(authRequest.idUsuarioRol)),
                    new Claim("nroIdentificacion", authRequest.nroIdentificacion),
                    new Claim("companyUniqueId", authRequest.rucEmpresa),
                    new Claim("companyId", Convert.ToString(authRequest.companyId)),
                    new Claim("razonSocial", authRequest.razonSocial),
                    new Claim("urlGateway", authRequest.urlGateway)
                });
            var securityTokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = claimsIdentiy,
                Expires = DateTime.UtcNow.AddMinutes(JWT_TOKEN_VALIDITY_MINS),
                SigningCredentials = signingCredentials
            };
            var jwtSecurityTokenHandler = new JwtSecurityTokenHandler();
            var securityToken = jwtSecurityTokenHandler.CreateToken(securityTokenDescriptor);
            return new AuthResponse
            {
                jwtToken = jwtSecurityTokenHandler.WriteToken(securityToken)
            };
        }
    }
}
