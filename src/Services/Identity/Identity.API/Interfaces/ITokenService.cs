using Identity.API.Dtos;
using Identity.Core.Entities;

namespace Identity.API.Interfaces
{
    public interface ITokenService
    {
        //Task<string> CreateToken(AppUser user);
        string GenerateJwtToken(LoginDataDto user);
        string GetJwtToken(UserDataDto data);
    }
}
