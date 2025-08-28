using Common.Core.Base;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mechanical.Domain.Entities;

[Table("SupportStatus", Schema = "Mechanical")]
public class SupportStatus : BaseEntity
{
    [Required][MaxLength(5)] public string Code { get; set; }

    [Required][MaxLength(100)] public string Name { get; set; }

    public int Order { get; set; }
}