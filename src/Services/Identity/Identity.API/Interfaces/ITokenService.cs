using Identity.API.Models;
namespace Identity.API.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(UserData data);
    }
}
