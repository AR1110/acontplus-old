using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Entities;

namespace Vet.API.Entities
{
    [Table("BehaviorTest", Schema = "Pet")]
    public class BehaviorTest : BaseEntity
    {
        public MedicalHistory MedicalHistory { get; set; }
        public int MedicalHistoryId { get; set; }
        public Behavior Behavior { get; set; }
        public int BehaviorId { get; set; }
        public BehaviorStatus BehaviorStatus { get; set; }
        public int BehaviorStatusId { get; set; }
    }
}
