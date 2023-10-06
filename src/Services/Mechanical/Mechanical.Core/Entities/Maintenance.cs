using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Entities;

namespace Mechanical.Core.Entities
{
    [Table("Maintenance", Schema = "Mechanical")]
    public class Maintenance : BaseEntity
    {
        public Support Support { get; set; }
        public int SupportId { get; set; }
        public DateTime Date { get; set; }
        public DateTime? DateEnd { get; set; }

        [MaxLength(300)]
        public string Obs { get; set; }
        public int CompanyId { get; set; }
        public int Status { get; set; } = 0;

        [Column(TypeName = "numeric(18,5), not null")]
        public decimal Total { get; set; }

    }
}
