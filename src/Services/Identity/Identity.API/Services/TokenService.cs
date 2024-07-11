namespace Identity.API.Services;

public class TokenService(IConfiguration configuration) : ITokenService
{
    private readonly int _exp = Convert.ToInt32(configuration["Token:Exp"]);
    private readonly bool _expInDays = Convert.ToBoolean(configuration["Token:ExpInDays"]);

    private readonly SymmetricSecurityKey _key = new(
        Encoding.UTF8.GetBytes(configuration["Token:Key"] ?? throw new InvalidOperationException()));

    public JwtResponse CreateToken(UserData data)
    {
        var credentials = new SigningCredentials(_key, SecurityAlgorithms.HmacSha256Signature);
        var expires = _expInDays ? DateTime.UtcNow.AddDays(_exp) : DateTime.UtcNow.AddMinutes(_exp);
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Name, data.Fullname ?? ""),
            new(JwtRegisteredClaimNames.GivenName, data.Fullname ?? ""),
            new(JwtRegisteredClaimNames.UniqueName, data.Username),
            new(ClaimTypes.NameIdentifier, Convert.ToString(data.UserId)),
            new(ClaimTypes.Role, data.Role),
            new("userRoleId", Convert.ToString(data.UserRoleId)),
            new("idCardCompany", data.IDCardCompany),
            new("companyId", Convert.ToString(data.CompanyId)),
            new("tradeName", data.TradeName),
            new("businessName", data.BusinessName),
            new("urlGateway", data.UrlGateway)
        };

        var jwtOptions = new JwtSecurityToken(
            claims: claims,
            expires: expires,
            signingCredentials: credentials);


        var token = new JwtSecurityTokenHandler().WriteToken(jwtOptions);
        return new JwtResponse { Expires = expires, Token = token };
    }
}
