namespace Identity.Infrastructure.Persistence.Repositories;

public class UserRepository : IUserRepository
{
    private readonly IAdoRepository _repository;
    private readonly ApplicationDbContext _context;
    private readonly UserManager<AppUser> _userManager;
    private readonly ILogger<UserRepository> _logger;

    public UserRepository(
        IAdoRepository repository,
        ApplicationDbContext context,
        UserManager<AppUser> userManager,
        ILogger<UserRepository> logger)
    {
        _repository = repository;
        _context = context;
        _userManager = userManager;
        _logger = logger;
    }

    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync("Seguridad.User_Get", parameters);
        return DataValidation.DataSetIsNull(ds)
            ? new SpResponse { Code = "0", Message = "No se encontraron datos" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<AppUser?> GetUserByIdAsync(int userId)
    {
        return await _context.Users
            .Include(u => u.UserProfile)
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Id == userId);
    }

    public async Task<AppUser?> GetUserByUsernameAsync(string username)
    {
        return await _userManager.FindByNameAsync(username);
    }

    public async Task<AppUser?> GetUserByEmailAsync(string email)
    {
        return await _userManager.FindByEmailAsync(email);
    }

    public async Task<UserProfile?> GetUserProfileAsync(int userId)
    {
        return await _context.UserProfiles
            .FirstOrDefaultAsync(up => up.AppUserId == userId);
    }

    public async Task<UserProfile> CreateOrUpdateUserProfileAsync(int userId, UserProfile profileData)
    {
        var existingProfile = await _context.UserProfiles
            .FirstOrDefaultAsync(up => up.AppUserId == userId);

        // Get AppUser to consider Identity-managed fields like PhoneNumber in scoring
        var appUser = await _userManager.FindByIdAsync(userId.ToString());
        var hasPhone = !string.IsNullOrWhiteSpace(appUser?.PhoneNumber);

        if (existingProfile == null)
        {
            profileData.AppUserId = userId;

            _context.UserProfiles.Add(profileData);
            _logger.LogInformation("Created new profile for user {UserId}",
                userId);
        }
        else
        {
            // Update existing profile
            UpdateExistingProfile(existingProfile, profileData);

            _context.UserProfiles.Update(existingProfile);
            _logger.LogInformation("Updated profile for user {UserId}",
                userId);

            profileData = existingProfile;
        }

        await _context.SaveChangesAsync();
        return profileData;
    }

    public async Task UpdateLastLoginAsync(int userId)
    {
        var profile = await _context.UserProfiles
            .FirstOrDefaultAsync(up => up.AppUserId == userId);

        if (profile != null)
        {
            profile.LastLoginDate = DateTime.UtcNow;
            _context.UserProfiles.Update(profile);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<AppUser>> GetUsersByRoleAsync(string roleName)
    {
        return await _context.Users
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
            .Where(u => u.UserRoles.Any(ur => ur.Role.Name == roleName))
            .ToListAsync();
    }

    public async Task<bool> IsUserInRoleAsync(int userId, string roleName)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        return user != null && await _userManager.IsInRoleAsync(user, roleName);
    }

    public async Task<IList<string>> GetUserRolesAsync(int userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        return user == null ? [] : await _userManager.GetRolesAsync(user);
    }

    public async Task UpdateUserPhoneNumberAsync(int userId, string phoneNumber)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null)
        {
            throw new InvalidOperationException($"User not found: {userId}");
        }

        var result = await _userManager.SetPhoneNumberAsync(user, phoneNumber);
        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new InvalidOperationException($"Failed to update phone number: {errors}");
        }
    }

    #region Private Helper Methods

    private static void UpdateExistingProfile(UserProfile existing, UserProfile updated)
    {
        // Core properties
        if (updated.PreferredLanguage != null) existing.PreferredLanguage = updated.PreferredLanguage;
        if (updated.TimeZone != null) existing.TimeZone = updated.TimeZone;
        if (updated.Theme != null) existing.Theme = updated.Theme;

        existing.EmailNotifications = updated.EmailNotifications;
        existing.SmsNotifications = updated.SmsNotifications;
        existing.WhatsAppNotifications = updated.WhatsAppNotifications;

        // Personal information
        if (updated.FirstName != null) existing.FirstName = updated.FirstName;
        if (updated.LastName != null) existing.LastName = updated.LastName;
        if (updated.DateOfBirth.HasValue) existing.DateOfBirth = updated.DateOfBirth;
        if (updated.Gender != null) existing.Gender = updated.Gender;

        // Simplified customer identification
        if (updated.CustomerId.HasValue) existing.CustomerId = updated.CustomerId;

        // Application preferences
        if (updated.DefaultCurrency != null) existing.DefaultCurrency = updated.DefaultCurrency;
        if (updated.DateFormat != null) existing.DateFormat = updated.DateFormat;
        if (updated.TimeFormat != null) existing.TimeFormat = updated.TimeFormat;
        if (updated.NumberFormat != null) existing.NumberFormat = updated.NumberFormat;
        if (updated.DefaultPageSize.HasValue) existing.DefaultPageSize = updated.DefaultPageSize;
        existing.ShowAdvancedFeatures = updated.ShowAdvancedFeatures;

        // Simplified JSON properties - only CustomProperties remains
        if (updated.CustomProperties != null) existing.CustomProperties = updated.CustomProperties;
    }

    #endregion
}
