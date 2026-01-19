namespace Identity.Application.Interfaces;

public interface IJwtTokenService
{
    JwtResponseDto CreateToken(UserDataDto data);
}
