using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Entities;

namespace FactElect.API.Entities;

[Table("Customer", Schema = "Customer")]
public class AppCustomer : BaseEntity
{
    public int IdTypeId { get; set; }
    [Required][MaxLength(15)] public string IdCard { get; set; }

    [Required][MaxLength(300)] public string BusinessName { get; set; }

    [MaxLength(300)] public string TradeName { get; set; }

    [MaxLength(500)] public string Email { get; set; }

    [MaxLength(300)] public string Telephone { get; set; }

    [MaxLength(500)] public string Address { get; set; }

    public bool? SriValidation { get; set; }
}
