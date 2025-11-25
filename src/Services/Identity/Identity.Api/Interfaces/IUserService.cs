namespace Identity.Api.Interfaces;

public interface IUserService
{
    // Original methods
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    Task<AppUser?> GetUserByIdAsync(int userId);
    Task<AppUser?> GetUserByUsernameAsync(string username);
    Task<AppUser?> GetUserByEmailAsync(string email);
    Task<UserProfile?> GetUserProfileAsync(int userId);
    Task<UserProfile> CreateOrUpdateUserProfileAsync(int userId, UserProfile profileData);
    Task UpdateLastLoginAsync(int userId);
    Task<IEnumerable<AppUser>> GetUsersByRoleAsync(string roleName);
    Task<bool> IsUserInRoleAsync(int userId, string roleName);
    Task<IList<string>> GetUserRolesAsync(int userId);

    // New: update phone number in AppUser (Identity)
    Task UpdateUserPhoneNumberAsync(int userId, string phoneNumber);
}
