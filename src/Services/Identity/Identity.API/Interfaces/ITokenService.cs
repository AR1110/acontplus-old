namespace Identity.API.Interfaces;

public interface ITokenService
{
    string CreateToken(UserData data);
}
