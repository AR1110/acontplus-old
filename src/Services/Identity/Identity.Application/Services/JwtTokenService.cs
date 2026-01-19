namespace Identity.Application.Services;

public class JwtTokenService(IConfiguration configuration) : IJwtTokenService
{
    private readonly IConfigurationSection _jwtSettings = configuration.GetSection("JwtSettings");

    public JwtResponseDto CreateToken(UserDataDto data)
    {
        var issuer = _jwtSettings["Issuer"]!;
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings["SecurityKey"]!));
        var accessTokenExpiration = Convert.ToInt32(_jwtSettings["AccessExpiration"]);

        // Get audience(s) - supports both string and array
        var audienceSection = _jwtSettings.GetSection("Audience");
        string[] audiences;

        if (audienceSection.Value != null)
        {
            // Single audience (string)
            audiences = new[] { audienceSection.Value };
        }
        else
        {
            // Multiple audiences (array)
            audiences = audienceSection.Get<string[]>() ?? new[] { "default" };
        }

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Email, data.Email ?? ""),
            new(JwtRegisteredClaimNames.GivenName, data.Fullname ?? ""),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(JwtRegisteredClaimNames.Name, data.Fullname ?? ""),
            new(ClaimTypes.NameIdentifier, Convert.ToString(data.UserId)),
            new(ClaimTypes.Role, data.Role ?? string.Empty),
            new(JwtRegisteredClaimNames.Sub, Convert.ToString(data.UserId)),
            new(JwtRegisteredClaimNames.UniqueName, data.Username ?? string.Empty),
            new("userRoleId", Convert.ToString(data.UserRoleId)),
            new("idCardCompany", data.IdCardCompany ?? string.Empty),
            new("companyId", Convert.ToString(data.CompanyId)),
            new("tradeName", data.TradeName ?? string.Empty),
            new("businessName", data.BusinessName ?? string.Empty),
            new("urlGateway", data.UrlGateway ?? string.Empty)
        };
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha512);

        // Use SecurityTokenDescriptor for better .NET 9 compatibility and performance
        var expires = DateTime.UtcNow.AddMinutes(accessTokenExpiration);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = expires,
            Issuer = issuer,
            Audience = audiences[0],
            SigningCredentials = credentials,
            NotBefore = DateTime.UtcNow
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return new JwtResponseDto { Token = tokenHandler.WriteToken(token), Expires = expires };
    }
}
