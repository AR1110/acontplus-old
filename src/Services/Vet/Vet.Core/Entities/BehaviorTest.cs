using System.ComponentModel.DataAnnotations.Schema;

namespace Vet.Core.Entities
{
    [Table("BehaviorTest", Schema = "Pet")]
    public class BehaviorTest : BaseEntity
    {
        public MedicalHistory PetService { get; set; }
        public int PetServiceId { get; set; }
        public Behavior Behavior { get; set; }
        public int BehaviorId { get; set; }
        public BehaviorStatus BehaviorStatus { get; set; }
        public int BehaviorStatusId { get; set; }
    }
}