using Restaurant.Core.Entities;

namespace Restaurant.Core.Interfaces
{
    public interface ITokenService
    {
        Task<string> CreateToken(AppUser user);
    }
}
