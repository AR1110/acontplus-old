namespace Identity.Domain.Repositories;

public interface IRefreshTokenRepository
{
    Task<RefreshToken> GenerateRefreshTokenAsync(int userId, string? ipAddress = null, string? userAgent = null, string? deviceInfo = null);
    Task<RefreshToken?> GetRefreshTokenAsync(string token);
    Task<bool> ValidateRefreshTokenAsync(string token, int userId);
    Task RevokeRefreshTokenAsync(string token, string? ipAddress = null, string? replacedByToken = null);
    Task RevokeAllUserRefreshTokensAsync(int userId, string? ipAddress = null);
    Task CleanupExpiredTokensAsync();
    Task<IEnumerable<RefreshToken>> GetActiveUserTokensAsync(int userId);
}
