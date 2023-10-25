using Identity.Core.Models;
namespace Identity.Core.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(UserData data);
    }
}
