using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using TechnicalSupport.API.Entities;

namespace TechnicalSupport.API.Dtos
{
    public class OrderDto
    {
        public Guid Uuid { get; set; }
        public int EstablecimientoId { get; set; }
        public int PuntoEmisionId { get; set; }
        public int CustomerCompanyId { get; set; }  
        [MaxLength(500)]
        public string Obs { get; set; }
        public int OrderStatusId { get; set; }
        public List<OrderDetail> OrderDetails { get; set; }
    }
}
