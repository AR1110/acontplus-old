namespace Identity.Api.Entities;

[Table("UserProfile", Schema = "Auth")]
public class UserProfile : BaseEntity
{
    public int AppUserId { get; set; }

    #region Core Profile Properties
    [MaxLength(50)] public string? PreferredLanguage { get; set; }
    [MaxLength(50)] public string? TimeZone { get; set; }
    [MaxLength(50)] public string? Theme { get; set; }
    public bool EmailNotifications { get; set; } = true;
    public bool SmsNotifications { get; set; } = false;
    public bool WhatsAppNotifications { get; set; } = false;
    #endregion

    #region Personal Information
    [MaxLength(100)] public string? FirstName { get; set; }
    [MaxLength(100)] public string? LastName { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public Gender Gender { get; set; }

    // Simplified customer identification
    public int? CustomerId { get; set; }
    #endregion

    #region Application Preferences
    [MaxLength(20)] public string? DefaultCurrency { get; set; } = "USD";
    [MaxLength(20)] public string? DateFormat { get; set; } = "dd/MM/yyyy";
    [MaxLength(20)] public string? TimeFormat { get; set; } = "HH:mm";
    [MaxLength(20)] public string? NumberFormat { get; set; } = "en-US";
    public int? DefaultPageSize { get; set; } = 25;
    public bool ShowAdvancedFeatures { get; set; } = false;
    #endregion

    #region Security & Access
    public DateTime? LastLoginDate { get; set; }
    public DateTime? LastPasswordChange { get; set; }
    public bool RequirePasswordChange { get; set; } = false;
    public int? SessionTimeoutMinutes { get; set; } = 60;
    #endregion

    #region Communication Preferences
    public bool ReceivePromotionalEmails { get; set; } = true;
    public bool ReceiveSystemUpdates { get; set; } = true;
    public bool ReceiveNewsletters { get; set; } = false;
    [MaxLength(100)] public string? PreferredContactMethod { get; set; } = "Email";
    [MaxLength(50)] public string? PreferredContactTime { get; set; }
    #endregion

    #region Flexible Properties
    // Single JSON column for additional flexible properties
    [Column(TypeName = "nvarchar(max)")]
    public string? CustomProperties { get; set; }
    #endregion

    // Navigation property
    public AppUser AppUser { get; set; } = null!;
}
