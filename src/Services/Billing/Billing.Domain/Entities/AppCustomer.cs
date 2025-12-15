namespace Billing.Domain.Entities;

[Table("Customer", Schema = "Customer")]
public class AppCustomer : BaseEntity
{
  public int IdTypeId { get; set; }
  [MaxLength(15)] public required string IdCard { get; set; }

  [MaxLength(300)] public required string BusinessName { get; set; }

  [MaxLength(300)] public string? TradeName { get; set; }

  [MaxLength(500)] public string? Email { get; set; }

  [MaxLength(300)] public string? Telephone { get; set; }

  [MaxLength(500)] public string? Address { get; set; }

  public bool? SriValidation { get; set; }

  public DateTime? BirthDate { get; set; }
}

//MIGRATE PHONES AND EMAILS TO SUPPORT MULTIPLE ENTRIES

//public class Customer
//{
//    public int Id { get; set; }
//    public string IdCard { get; set; }
//    public string BusinessName { get; set; }
//    public string TradeName { get; set; }
//    public string PrimaryEmail { get; set; }
//    public string PrimaryPhone { get; set; } // Direct access to main phone
//    public string Phones { get; set; } // JSON string
//    public string Emails { get; set; } // JSON string
//    public string Address { get; set; }

//    // Helper properties (not mapped to DB)
//    [NotMapped]
//    public List<PhoneInfo> PhoneList =>
//        string.IsNullOrEmpty(Phones) ? new() : JsonSerializer.Deserialize<List<PhoneInfo>>(Phones);

//    [NotMapped]
//    public List<string> EmailList =>
//        string.IsNullOrEmpty(Emails) ? new() : JsonSerializer.Deserialize<List<string>>(Emails);
//}

//public class PhoneInfo
//{
//    public string Number { get; set; }
//    public string Type { get; set; } = "mobile";
//    public bool Primary { get; set; }
//}
