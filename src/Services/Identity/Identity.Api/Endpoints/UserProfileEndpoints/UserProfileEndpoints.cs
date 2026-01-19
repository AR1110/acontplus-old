using Identity.Domain.Repositories;

namespace Identity.Api.Endpoints.UserProfileEndpoints;

public static class UserProfileEndpoints
{
    public static void MapUserProfileEndpoints(this IEndpointRouteBuilder app)
    {
        // Create API version set for UserProfile
        var apiVersionSet = app.NewApiVersionSet()
            .HasApiVersion(new ApiVersion(3, 0))
            .ReportApiVersions()
            .Build();

        var userProfileGroup = app.MapGroup("/api/v{version:apiVersion}/UserProfile")
            .WithApiVersionSet(apiVersionSet)
            .MapToApiVersion(new ApiVersion(3, 0))
            .RequireAuthorization()
            .WithTags("UserProfile V3")
            ;

        // GET user profile by userId
        userProfileGroup.MapGet("/{userId:int}", async (
            int userId,
            IUserRepository userService,
            ILogger<IUserRepository> logger) =>
        {
            try
            {
                var profile = await userService.GetUserProfileAsync(userId);
                if (profile == null)
                {
                    return Results.NotFound($"Profile not found for user {userId}");
                }

                var appUser = await userService.GetUserByIdAsync(userId);
                var profileDto = MapToDto(profile, appUser?.PhoneNumber);
                return Results.Ok(profileDto);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error retrieving profile for user {UserId}", userId);
                return Results.Problem("Internal server error", statusCode: 500);
            }
        })
        .WithSummary("Get user profile by ID")
        .WithDescription("Retrieves a user profile for the specified user ID")
        .WithName("GetUserProfile");

        // PUT update user profile
        userProfileGroup.MapPut("/{userId:int}", async (
            int userId,
            UserProfileUpdateDto updateDto,
            IUserRepository userService,
            ILogger<IUserRepository> logger) =>
        {
            try
            {
                var existingProfile = await userService.GetUserProfileAsync(userId);
                var profileToUpdate = existingProfile ?? new UserProfile { AppUserId = userId, Id = 0 };

                // Update phone number in Identity first so completion scoring includes it
                if (!string.IsNullOrWhiteSpace(updateDto.PhoneNumber))
                {
                    await userService.UpdateUserPhoneNumberAsync(userId, updateDto.PhoneNumber);
                }

                // Map from DTO to entity (excluding phone)
                MapFromUpdateDto(updateDto, profileToUpdate);

                var updatedProfile = await userService.CreateOrUpdateUserProfileAsync(userId, profileToUpdate);
                var appUser = await userService.GetUserByIdAsync(userId);
                var resultDto = MapToDto(updatedProfile, appUser?.PhoneNumber);

                logger.LogInformation("Profile updated for user {UserId}", userId);

                return Results.Ok(resultDto);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error updating profile for user {UserId}", userId);
                return Results.Problem("Internal server error", statusCode: 500);
            }
        })
        .WithSummary("Update user profile")
        .WithDescription("Updates a user profile for the specified user ID")
        .WithName("UpdateUserProfile");

        // Configuration-style endpoints for backward compatibility
        MapConfigurationStyleEndpoints(userProfileGroup);
    }

    private static void MapConfigurationStyleEndpoints(RouteGroupBuilder group)
    {
        // GET user profile (Configuration style)
        group.MapGet("/config", async (
            string? json,
            IUserProfileService userProfileService,
            IUserContext userContext,
            ILogger<IUserProfileService> logger) =>
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    { "userRoleId", userContext.GetClaimValue<int>("userRoleId") }
                };

                var response = await userProfileService.GetAsync(parameters);
                return response == null ? Results.NoContent() : Results.Ok(response);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error retrieving user profile (config style)");
                return Results.Problem("Internal server error", statusCode: 500);
            }
        })
        .WithName("GetUserProfileConfig")
        .WithSummary("Get user profile (Configuration style)")
        .WithDescription("Retrieves user profile using Configuration service pattern");

        // PUT update user profile (Configuration style)
        group.MapPut("/config/{id:int}", async (
            int id,
            UserProfileDto dto,
            IUserProfileService userProfileService,
            ILogger<IUserProfileService> logger) =>
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    { "id", id },
                    { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<UserProfileDto>(dto)) }
                };

                var response = await userProfileService.UpdateAsync(parameters);
                return response == null ? Results.NoContent() : Results.Ok(response);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error updating user profile (config style) for ID {Id}", id);
                return Results.Problem("Internal server error", statusCode: 500);
            }
        })
        .WithName("UpdateUserProfileConfig")
        .WithSummary("Update user profile (Configuration style)")
        .WithDescription("Updates user profile using Configuration service pattern");
    }

    #region Private Helper Methods

    private static UserProfileDto MapToDto(UserProfile profile, string? phoneNumber)
    {
        return new UserProfileDto
        {
            // Core Profile Properties
            PreferredLanguage = profile.PreferredLanguage,
            TimeZone = profile.TimeZone,
            Theme = profile.Theme,
            EmailNotifications = profile.EmailNotifications,
            SmsNotifications = profile.SmsNotifications,
            WhatsAppNotifications = profile.WhatsAppNotifications,

            // Personal Information
            FirstName = profile.FirstName,
            LastName = profile.LastName,
            PhoneNumber = phoneNumber,
            DateOfBirth = profile.DateOfBirth,
            Gender = profile.Gender.ToString(),
            CustomerId = profile.CustomerId,

            // Application Preferences
            DefaultCurrency = profile.DefaultCurrency,
            DateFormat = profile.DateFormat,
            TimeFormat = profile.TimeFormat,
            NumberFormat = profile.NumberFormat,
            DefaultPageSize = profile.DefaultPageSize,
            ShowAdvancedFeatures = profile.ShowAdvancedFeatures,

            // Communication Preferences
            ReceivePromotionalEmails = profile.ReceivePromotionalEmails,
            ReceiveSystemUpdates = profile.ReceiveSystemUpdates,
            ReceiveNewsletters = profile.ReceiveNewsletters,
            PreferredContactMethod = profile.PreferredContactMethod,
            PreferredContactTime = profile.PreferredContactTime,

            // Status Information
            LastLoginDate = profile.LastLoginDate
        };
    }

    private static void MapFromUpdateDto(UserProfileUpdateDto updateDto, UserProfile profile)
    {
        // Core Profile Properties
        if (updateDto.PreferredLanguage != null) profile.PreferredLanguage = updateDto.PreferredLanguage;
        if (updateDto.TimeZone != null) profile.TimeZone = updateDto.TimeZone;
        if (updateDto.Theme != null) profile.Theme = updateDto.Theme;
        if (updateDto.EmailNotifications.HasValue) profile.EmailNotifications = updateDto.EmailNotifications.Value;
        if (updateDto.SmsNotifications.HasValue) profile.SmsNotifications = updateDto.SmsNotifications.Value;
        if (updateDto.WhatsAppNotifications.HasValue) profile.WhatsAppNotifications = updateDto.WhatsAppNotifications.Value;

        // Personal Information
        if (updateDto.FirstName != null) profile.FirstName = updateDto.FirstName;
        if (updateDto.LastName != null) profile.LastName = updateDto.LastName;
        // PhoneNumber handled via AppUser (Identity)
        if (updateDto.DateOfBirth.HasValue) profile.DateOfBirth = updateDto.DateOfBirth;
        if (updateDto.Gender != null)
        {
            if (Enum.TryParse<Acontplus.Core.Enums.Gender>(updateDto.Gender, true, out var gender))
            {
                profile.Gender = gender;
            }
        }
        if (updateDto.CustomerId.HasValue) profile.CustomerId = updateDto.CustomerId;

        // Application Preferences
        if (updateDto.DefaultCurrency != null) profile.DefaultCurrency = updateDto.DefaultCurrency;
        if (updateDto.DateFormat != null) profile.DateFormat = updateDto.DateFormat;
        if (updateDto.TimeFormat != null) profile.TimeFormat = updateDto.TimeFormat;
        if (updateDto.NumberFormat != null) profile.NumberFormat = updateDto.NumberFormat;
        if (updateDto.DefaultPageSize.HasValue) profile.DefaultPageSize = updateDto.DefaultPageSize;
        if (updateDto.ShowAdvancedFeatures.HasValue) profile.ShowAdvancedFeatures = updateDto.ShowAdvancedFeatures.Value;
    }

    #endregion
}
