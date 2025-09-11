namespace Identity.API.Services;

public interface IJwtTokenService
{
    JwtResponseDto CreateToken(UserDataDto data);
}

public class JwtTokenService(IConfiguration configuration) : IJwtTokenService
{
    private readonly int _exp = Convert.ToInt32(configuration["JwtSettings:ExpirationInMinutes"]);

    private readonly SymmetricSecurityKey _key = new(
        Encoding.UTF8.GetBytes(configuration["JwtSettings:SecurityKey"] ?? throw new InvalidOperationException()));

    public JwtResponseDto CreateToken(UserDataDto data)
    {
        var credentials = new SigningCredentials(_key, SecurityAlgorithms.HmacSha256Signature);
        var expires = DateTime.UtcNow.AddMinutes(_exp);
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Email, data.Email ?? ""),
            new(JwtRegisteredClaimNames.GivenName, data.Fullname ?? ""),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(JwtRegisteredClaimNames.Name, data.Fullname ?? ""),
            new(ClaimTypes.NameIdentifier, Convert.ToString(data.UserId)),
            new(ClaimTypes.Role, data.Role),
            new(JwtRegisteredClaimNames.Sub, Convert.ToString(data.UserId)),
            new(JwtRegisteredClaimNames.UniqueName, data.Username),
            new("userRoleId", Convert.ToString(data.UserRoleId)),
            new("idCardCompany", data.IdCardCompany),
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
        return new JwtResponseDto { Expires = expires, Token = token };
    }
}