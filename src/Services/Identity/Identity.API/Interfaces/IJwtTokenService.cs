namespace Identity.API.Interfaces;

public interface IJwtTokenService
{
    JwtResponseDto CreateToken(UserDataDto data);
}
