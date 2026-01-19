using System.Security.Cryptography;

namespace Identity.Infrastructure.Persistence.Repositories;

public class RefreshTokenRepository : IRefreshTokenRepository
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<RefreshTokenRepository> _logger;
    private readonly IConfiguration _configuration;

    public RefreshTokenRepository(
        ApplicationDbContext context,
        ILogger<RefreshTokenRepository> logger,
        IConfiguration configuration)
    {
        _context = context;
        _logger = logger;
        _configuration = configuration;
    }

    public async Task<RefreshToken> GenerateRefreshTokenAsync(int userId, string? ipAddress = null, string? userAgent = null, string? deviceInfo = null)
    {
        var tokenLifetimeMinutes = _configuration.GetValue<int>("JwtSettings:RefreshTokenExpirationInMinutes", 10080); // Default 7 days

        var refreshToken = new RefreshToken
        {
            Token = GenerateSecureToken(),
            Expires = DateTime.UtcNow.AddMinutes(tokenLifetimeMinutes),
            Created = DateTime.UtcNow,
            CreatedByIp = ipAddress,
            UserAgent = userAgent,
            DeviceInfo = deviceInfo,
            UserId = userId,
            // AppUser = await _context.Users.FindAsync(userId) ?? throw new ArgumentException("User not found", nameof(userId))
        };

        _context.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Generated refresh token for user {UserId} from IP {IpAddress}", userId, ipAddress);

        return refreshToken;
    }

    public async Task<RefreshToken?> GetRefreshTokenAsync(string token)
    {
        return await _context.RefreshTokens
            //.Include(rt => rt.AppUser)
            .FirstOrDefaultAsync(rt => rt.Token == token);
    }

    public async Task<bool> ValidateRefreshTokenAsync(string token, int userId)
    {
        var refreshToken = await _context.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == token && rt.UserId == userId);

        if (refreshToken == null)
        {
            _logger.LogWarning("Refresh token not found for user {UserId}", userId);
            return false;
        }

        if (!refreshToken.IsActive)
        {
            _logger.LogWarning("Inactive refresh token used by user {UserId}", userId);
            return false;
        }

        return true;
    }

    public async Task RevokeRefreshTokenAsync(string token, string? ipAddress = null, string? replacedByToken = null)
    {
        var refreshToken = await _context.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == token);

        if (refreshToken != null && refreshToken.IsActive)
        {
            refreshToken.Revoked = DateTime.UtcNow;
            refreshToken.RevokedByIp = ipAddress;
            refreshToken.ReplacedByToken = replacedByToken;

            _context.RefreshTokens.Update(refreshToken);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Revoked refresh token for user {UserId} from IP {IpAddress}",
                refreshToken.UserId, ipAddress);
        }
    }

    public async Task RevokeAllUserRefreshTokensAsync(int userId, string? ipAddress = null)
    {
        var activeTokens = await _context.RefreshTokens
            .Where(rt => rt.UserId == userId && rt.Revoked == null && rt.Expires > DateTime.UtcNow)
            .ToListAsync();

        foreach (var token in activeTokens)
        {
            token.Revoked = DateTime.UtcNow;
            token.RevokedByIp = ipAddress;
        }

        if (activeTokens.Any())
        {
            _context.RefreshTokens.UpdateRange(activeTokens);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Revoked {Count} refresh tokens for user {UserId}",
                activeTokens.Count, userId);
        }
    }

    public async Task CleanupExpiredTokensAsync()
    {
        var cutoffDate = DateTime.UtcNow.AddDays(-30); // Keep revoked tokens for 30 days for audit

        var expiredTokens = await _context.RefreshTokens
            .Where(rt => rt.Expires < DateTime.UtcNow &&
                        (rt.Revoked == null || rt.Revoked < cutoffDate))
            .ToListAsync();

        if (expiredTokens.Any())
        {
            _context.RefreshTokens.RemoveRange(expiredTokens);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Cleaned up {Count} expired refresh tokens", expiredTokens.Count);
        }
    }

    public async Task<IEnumerable<RefreshToken>> GetActiveUserTokensAsync(int userId)
    {
        return await _context.RefreshTokens
            .Where(rt => rt.UserId == userId && rt.IsActive)
            .OrderByDescending(rt => rt.Created)
            .ToListAsync();
    }

    private static string GenerateSecureToken()
    {
        using var rng = RandomNumberGenerator.Create();
        var randomBytes = new byte[64];
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }
}
