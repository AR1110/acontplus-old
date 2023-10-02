using System.ComponentModel.DataAnnotations.Schema;

namespace Mechanical.Core.Entities
{
    [Table("MaintenanceDetail", Schema = "Mechanical")]
    public class MaintenanceDetail : BaseEntity
    {
        public Maintenance Maintenance { get; set; }
        public int MaintenanceId { get; set; }
        public int ArticuloId { get; set; }
        public string Description { get; set; }
        
        [Column(TypeName = "numeric(18,5), not null")]
        public decimal Quantity { get; set; }
    }
}
