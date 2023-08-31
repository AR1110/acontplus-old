using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mechanical.Core.Entities
{
    [Table("SupportDetail", Schema = "Mechanical")]
    public class SupportDetail  : BaseEntity
    {
        public Support support { get; set; }
        public int SupportId { get; set; }

    }
}
