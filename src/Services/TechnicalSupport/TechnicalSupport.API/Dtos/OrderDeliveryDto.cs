namespace TechnicalSupport.API.Dtos
{
    public class OrderDeliveryDto
    {
        public bool IsOtherReceiver { get; set; }
        public string ReceiverGovernmentId { get; set; }
        public string Receiver { get; set; }
        public int UserId { get; set; }
    }
}
