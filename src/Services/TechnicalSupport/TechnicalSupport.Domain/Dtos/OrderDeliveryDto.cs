namespace TechnicalSupport.Domain.DTOs;

public class OrderDeliveryDto
{
    public bool IsOtherReceiver { get; set; }
    public required string ReceiverGovernmentId { get; set; }
    public required string Receiver { get; set; }
    public int UserId { get; set; }
}
