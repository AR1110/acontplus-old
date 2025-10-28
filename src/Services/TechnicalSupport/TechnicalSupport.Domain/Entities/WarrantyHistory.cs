using System.ComponentModel.DataAnnotations.Schema;

namespace TechnicalSupport.Domain.Entities;

[Table("WarrantyHistory", Schema = "TechnicalSupport")]
public class WarrantyHistory : BaseEntity
{
    public required DeviceCustomer DeviceCustomer { get; set; }
    public int DeviceCustomerId { get; set; }
    public DateTime WarrantyStartDate { get; set; }
    public DateTime WarrantyEndDate { get; set; }
}
