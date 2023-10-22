namespace Identity.API.Interfaces;

public interface IUserAuthenticationRepository
{
    //Task<IdentityResult> RegisterUserAsync(UserRegistrationDto userForRegistration);
    //Task<bool> ValidateUserAsync(UserLoginDto loginDto); 
    Task<string> CreateTokenAsync();
}

