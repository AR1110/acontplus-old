using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Entities;

namespace Mechanical.Core.Entities
{
    [Table("Maintenance", Schema = "Mechanical")]
    public class Maintenance : BaseEntity
    {
        public Inspection Inspection { get; set; }
        public int InspectionId { get; set; }
        public DateTime Date { get; set; }
        public DateTime? DateEnd { get; set; }

        [MaxLength(300)]
        public string Obs { get; set; }
        public int CompanyId { get; set; }
        public int Status { get; set; } = 0;


    }
}
