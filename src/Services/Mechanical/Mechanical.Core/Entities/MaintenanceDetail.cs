using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Entities;

namespace Mechanical.Core.Entities
{
    [Table("MaintenanceDetail", Schema = "Mechanical")]
    public class MaintenanceDetail : BaseEntity
    {
        public Maintenance Maintenance { get; set; }
        public int MaintenanceId { get; set; }
        public int ArticuloId { get; set; }
        public int TarifaId { get; set; }
        public int BodegaId { get; set; }
        public int MedidaId { get; set; }

        [Required]
        [MaxLength(300)]
        public string Description { get; set; }

        [Column(TypeName = "numeric(18,5), not null")]
        public decimal Quantity { get; set; }

        [Column(TypeName = "numeric(18,5), not null")]
        public decimal Price { get; set; }
        
        [Column(TypeName = "numeric(18,5), not null")]
        public decimal Cost { get; set; }

        [Column(TypeName = "numeric(18,5), not null")]
        public decimal Total { get; set; }

        [Required]
        [MaxLength(10)]
        public string CodePercentage { get; set; }
        
        [Column(TypeName = "numeric(18,5), not null")]
        public decimal Percentage { get; set; }


        [MaxLength(250)]
        public string Obs { get; set; }


    }
}
