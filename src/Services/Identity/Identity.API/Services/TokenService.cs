using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Identity.API.Interfaces;
using Identity.API.Models;
using Microsoft.IdentityModel.Tokens;

namespace Identity.API.Services
{
    public class TokenService : ITokenService
    {
        private readonly SymmetricSecurityKey _key;
        public int _tokenExp;
        public TokenService(IConfiguration configuration)
        {
            //var tokenKey = Encoding.UTF8.GetBytes((_configuration["Token:Key"]).PadRight((512 / 8), '\0'));
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Token:Key"]));
            _tokenExp = Convert.ToInt32(configuration["Token:Exp"]);
        }
        public string CreateToken(UserData data)
        {
            var signingCredentials = new SigningCredentials(_key, SecurityAlgorithms.HmacSha256Signature);
            var claimsIdentiy = new ClaimsIdentity(new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Name, data.Fullname),
                    new Claim(JwtRegisteredClaimNames.GivenName, data.Fullname),
                    new Claim(JwtRegisteredClaimNames.UniqueName, data.Username),
                    new Claim(ClaimTypes.NameIdentifier, Convert.ToString(data.UserId)),
                    new Claim(ClaimTypes.Role, data.Role),
                    new Claim("userRoleId", Convert.ToString(data.UserRoleId)),
                    new Claim("idCardUser", data.IDCardUser),
                    new Claim("idCardCompany", data.IDCardCompany),
                    new Claim("companyId", Convert.ToString(data.CompanyId)),
                    new Claim("tradeName", data.TradeName),
                    new Claim("bussinesName", data.BussinesName),
                    new Claim("urlGateway", data.UrlGateway),
                    //Legacy
                    new Claim("idUsuarioRol", Convert.ToString(data.UserRoleId)),
                    new Claim("nroIdentificacion", data.IDCardUser),
                    new Claim("razonSocial", data.TradeName)
                });
            var securityTokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = claimsIdentiy,
                Expires = DateTime.UtcNow.AddDays(_tokenExp),
                SigningCredentials = signingCredentials
            };
            var jwtSecurityTokenHandler = new JwtSecurityTokenHandler();
            var securityToken = jwtSecurityTokenHandler.CreateToken(securityTokenDescriptor);
            return jwtSecurityTokenHandler.WriteToken(securityToken);
        }
    }
}
