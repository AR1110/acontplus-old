namespace Vet.Domain.Entities;

[Table("BehaviorTest", Schema = "Vet")]
public class BehaviorTest : BaseEntity
{
    public required MedicalHistory MedicalHistory { get; set; }
    public int MedicalHistoryId { get; set; }
    public required Behavior Behavior { get; set; }
    public int BehaviorId { get; set; }
    public required BehaviorStatus BehaviorStatus { get; set; }
    public int BehaviorStatusId { get; set; }
}
