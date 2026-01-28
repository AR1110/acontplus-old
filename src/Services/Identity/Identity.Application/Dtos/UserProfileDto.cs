namespace Identity.Application.Dtos;

public class UserProfileDto
{
    #region Core Profile Properties
    public string? PreferredLanguage { get; set; }
    public string? TimeZone { get; set; }
    public string? Theme { get; set; }
    public bool EmailNotifications { get; set; }
    public bool SmsNotifications { get; set; }
    public bool WhatsAppNotifications { get; set; }
    #endregion

    #region Personal Information
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? PhoneNumber { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Gender { get; set; }

    // Simplified customer identification
    public int? CustomerId { get; set; }
    #endregion

    #region Application Preferences
    public string? DefaultCurrency { get; set; }
    public string? DateFormat { get; set; }
    public string? TimeFormat { get; set; }
    public string? NumberFormat { get; set; }
    public int? DefaultPageSize { get; set; }
    public bool ShowAdvancedFeatures { get; set; }
    #endregion

    #region Communication Preferences
    public bool ReceivePromotionalEmails { get; set; }
    public bool ReceiveSystemUpdates { get; set; }
    public bool ReceiveNewsletters { get; set; }
    public string? PreferredContactMethod { get; set; }
    public string? PreferredContactTime { get; set; }
    #endregion

    #region Status Information (Read-only)
    public DateTime? LastLoginDate { get; set; }
    #endregion
}

public class UserProfileUpdateDto
{
    #region Core Profile Properties
    public string? PreferredLanguage { get; set; }
    public string? TimeZone { get; set; }
    public string? Theme { get; set; }
    public bool? EmailNotifications { get; set; }
    public bool? SmsNotifications { get; set; }
    public bool? WhatsAppNotifications { get; set; }
    #endregion

    #region Personal Information
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? PhoneNumber { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Gender { get; set; }

    // Simplified customer identification
    public int? CustomerId { get; set; }
    #endregion

    #region Application Preferences
    public string? DefaultCurrency { get; set; }
    public string? DateFormat { get; set; }
    public string? TimeFormat { get; set; }
    public string? NumberFormat { get; set; }
    public int? DefaultPageSize { get; set; }
    public bool? ShowAdvancedFeatures { get; set; }
    #endregion
}

public class CommunicationPreferencesDto
{
    public bool EmailNotifications { get; set; }
    public bool SmsNotifications { get; set; }
    public bool WhatsAppNotifications { get; set; }
    public bool ReceivePromotionalEmails { get; set; }
    public bool ReceiveSystemUpdates { get; set; }
    public bool ReceiveNewsletters { get; set; }
    public string? PreferredContactMethod { get; set; }
    public string? PreferredContactTime { get; set; }
}
