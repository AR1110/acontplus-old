using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mechanical.Core.Entities
{
    [Table("Support", Schema = "Mechanical")]
    public class Support : BaseEntity
    {

        public int PuntoEmisionId { get; set; }
        [Required]
        public DateTime Date { get; set; }
        public int Sequence { get; set; }
        public SupportType SupportType { get; set; }
        public int SupportTypeId { get; set; }
        public VehicleCompany VehicleCompany { get; set; }
        public int VehicleCompanyId { get; set; }
        public int CustomerId { get; set; }
      
        [MaxLength(500)]
        public string Obs { get; set; }
        public int CompanyId { get; set; }
        public int UserId { get; set; }
        public int UserAssignedId { get; set; }
        public int Status { get; set; } = 0;
    }
}
