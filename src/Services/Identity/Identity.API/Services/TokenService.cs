using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace Identity.API.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _configuration;
        private readonly SymmetricSecurityKey _key;
        public readonly bool _expInDays;
        public readonly int _exp;
        public TokenService(IConfiguration configuration)
        {
            _configuration = configuration;
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Token:Key"]));
            _exp = Convert.ToInt32(_configuration["Token:Exp"]);
            _expInDays = Convert.ToBoolean(_configuration["Token:ExpInDays"]);
        }
        public string CreateToken(UserData data)
        {
            var credentials = new SigningCredentials(_key, SecurityAlgorithms.HmacSha256Signature);
            var claims = new List<Claim>
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
                    new Claim("businessName", data.BusinessName),
                    new Claim("urlGateway", data.UrlGateway),
                    //Legacy
                    new Claim("idUsuarioRol", Convert.ToString(data.UserRoleId)),
                    new Claim("nroIdentificacion", data.IDCardUser),
                    new Claim("razonSocial", data.TradeName)
                };

            var jwtOptions = new JwtSecurityToken(
                     claims: claims,
                     expires: _expInDays ? DateTime.UtcNow.AddDays(_exp) : DateTime.UtcNow.AddMinutes(_exp),
                     signingCredentials: credentials);


            var token = new JwtSecurityTokenHandler().WriteToken(jwtOptions);
            return token;
        }
    }
}
