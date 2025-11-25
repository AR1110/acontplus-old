namespace Identity.Api.Interfaces;

public interface IJwtTokenService
{
    JwtResponseDto CreateToken(UserDataDto data);
}
