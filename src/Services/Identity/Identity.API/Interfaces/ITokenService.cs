namespace Identity.API.Interfaces;

public interface ITokenService
{
    JwtResponse CreateToken(UserData data);
}
