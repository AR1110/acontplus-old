using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TechnicalSupport.Domain.Entities;

[Table("DeviceCustomer", Schema = "TechnicalSupport")]
public class DeviceCustomer : BaseEntity
{
  public required Device Device { get; set; }
  public int DeviceId { get; set; }
  public int CustomerCompanyId { get; set; }

  [MaxLength(300)] public required string SerialNumber { get; set; }

  public DateTime? WarrantyStartDate { get; set; }
  public DateTime? WarrantyEndDate { get; set; }
}
