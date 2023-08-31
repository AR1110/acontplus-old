using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mechanical.Core.Entities
{
    [Table("Support", Schema = "Mechanical")]
    public class Support : BaseEntity
    {

        public int PuntoEmisionId { get; set; }
        [Required]
        public DateTime Date { get; set; }
        public int Sequence { get; set; }
        public VehicleCompany VehicleCompany { get; set; }
        public int VehicleCompanyId { get; set; }
        public int CustomerId { get; set; }
        [Column(TypeName = "numeric(18,5), not null")]
        public decimal TotalWithoutTaxes { get; set; }

        [Column(TypeName = "numeric(18,5), not null")]
        public decimal Total { get; set;}
        [Required]
        [MaxLength(50)]
        public int CompanyId { get; set; }
        public int UserId { get; set; }
    }
}
