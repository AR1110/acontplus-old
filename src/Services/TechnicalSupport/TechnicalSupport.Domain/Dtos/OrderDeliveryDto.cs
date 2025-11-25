namespace TechnicalSupport.Domain.Dtos;

public class OrderDeliveryDto
{
    public bool IsOtherReceiver { get; set; }
    public required string ReceiverGovernmentId { get; set; }
    public required string Receiver { get; set; }
    public int UserId { get; set; }
}
