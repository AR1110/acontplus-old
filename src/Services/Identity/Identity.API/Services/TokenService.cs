namespace Identity.API.Services;

public class TokenService : ITokenService
{
    private readonly IConfiguration _configuration;
    public readonly int _exp;
    public readonly bool _expInDays;
    private readonly SymmetricSecurityKey _key;

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
            new(JwtRegisteredClaimNames.Name, data.Fullname),
            new(JwtRegisteredClaimNames.GivenName, data.Fullname),
            new(JwtRegisteredClaimNames.UniqueName, data.Username),
            new(ClaimTypes.NameIdentifier, Convert.ToString(data.UserId)),
            new(ClaimTypes.Role, data.Role),
            new("userRoleId", Convert.ToString(data.UserRoleId)),
            new("idCardUser", data.IDCardUser),
            new("idCardCompany", data.IDCardCompany),
            new("companyId", Convert.ToString(data.CompanyId)),
            new("tradeName", data.TradeName),
            new("businessName", data.BusinessName),
            new("urlGateway", data.UrlGateway),
            //Legacy
            new("idUsuarioRol", Convert.ToString(data.UserRoleId)),
            new("nroIdentificacion", data.IDCardUser),
            new("razonSocial", data.TradeName)
        };

        var jwtOptions = new JwtSecurityToken(
            claims: claims,
            expires: _expInDays ? DateTime.UtcNow.AddDays(_exp) : DateTime.UtcNow.AddMinutes(_exp),
            signingCredentials: credentials);


        var token = new JwtSecurityTokenHandler().WriteToken(jwtOptions);
        return token;
    }
}
