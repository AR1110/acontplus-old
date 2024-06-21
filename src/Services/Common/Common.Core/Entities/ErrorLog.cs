using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Common.Core.Entities;

[Table("ErrorLog", Schema = "Common")]
public class ErrorLog : BaseEntity
{
    public Guid Token { get; set; }

    [MaxLength(100)] public string ErrorMethod { get; set; }

    public int ErrorNumber { get; set; }
    public int ErrorSeverity { get; set; }
    public int ErrorState { get; set; }

    [MaxLength(150)] public string ErrorProcedure { get; set; }

    public int ErrorLine { get; set; }

    [MaxLength(300)] public string ErrorMessage { get; set; }
}
