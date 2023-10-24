using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Identity.API.Dtos;
using Identity.API.Interfaces;
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

        //public async Task<string> CreateToken(AppUser user)
        //{
        //    var claims = new List<Claim>
        //    {
        //        new Claim(JwtRegisteredClaimNames.NameId, user.Id),
        //        new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName),
        //        new Claim(ClaimTypes.Email, user.Email),
        //        new Claim(ClaimTypes.GivenName, user.DisplayName),
        //    };
        //    var roles = await _userManager.GetRolesAsync(user);

        //    claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        //    var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha256Signature);
        //    var TokenDesc = new SecurityTokenDescriptor
        //    {
        //        Subject = new ClaimsIdentity(claims),
        //        //Audience = appUser.DisplayName,
        //        Expires = DateTime.Now.AddDays(365),
        //        SigningCredentials = creds,
        //        //Issuer = _configuration["Token:Issuer"],

        //    };
        //    var tokenhandler = new JwtSecurityTokenHandler();
        //    var token = tokenhandler.CreateToken(TokenDesc);
        //    return tokenhandler.WriteToken(token);
        //}

        public string GenerateJwtToken(LoginDataDto authRequest)
        {
            //var tokenKey = Encoding.ASCII.GetBytes(JWT_SECURITY_KEY);
            var signingCredentials = new SigningCredentials(_key, SecurityAlgorithms.HmacSha256Signature);
            var claimsIdentiy = new ClaimsIdentity(new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Name, authRequest.fullName),
                    new Claim(JwtRegisteredClaimNames.GivenName, authRequest.fullName),
                    new Claim(JwtRegisteredClaimNames.UniqueName, authRequest.userName),
                    new Claim(ClaimTypes.NameIdentifier, Convert.ToString(authRequest.idUsuario)),
                    new Claim(ClaimTypes.Role, authRequest.role),
                    new Claim("idUsuarioRol", Convert.ToString(authRequest.idUsuarioRol)),
                    new Claim("userRoleId", Convert.ToString(authRequest.idUsuarioRol)),
                    new Claim("nroIdentificacion", authRequest.nroIdentificacion),
                    new Claim("companyRuc", authRequest.rucEmpresa),
                    new Claim("companyId", Convert.ToString(authRequest.companyId)),
                    new Claim("razonSocial", authRequest.razonSocial),
                    new Claim("urlGateway", authRequest.urlGateway)
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

        public string GetJwtToken(UserDataDto data)
        {
            var signingCredentials = new SigningCredentials(_key, SecurityAlgorithms.HmacSha256Signature);
            var claimsIdentiy = new ClaimsIdentity(new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Name, data.Fullname),
                    new Claim(JwtRegisteredClaimNames.GivenName, data.Fullname),
                    new Claim(JwtRegisteredClaimNames.UniqueName, data.Username),
                    new Claim(ClaimTypes.NameIdentifier, Convert.ToString(data.UserId)),
                    new Claim(ClaimTypes.Role, data.Role),
                    new Claim("UserRoleId", Convert.ToString(data.UserRoleId)),
                    new Claim("idUsuarioRol", Convert.ToString(data.UserRoleId)),
                    new Claim("IDCardUser", data.IDCardUser),
                    new Claim("IDCardCompany", data.IDCardCompany),
                    new Claim("CompanyId", Convert.ToString(data.CompanyId)),
                    new Claim("TradeName", data.TradeName),
                    new Claim("BussinesName", data.BussinesName),
                    new Claim("UrlGateway", data.UrlGateway)
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
