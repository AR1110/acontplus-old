namespace Domain.Config.Dtos
{
    public class PrinterDto
    {
        public string machine { get; set; }
        public string driverName { get; set; }
        public string name {  get; set; }
        public bool isDefault { get; set; }
        public bool isThermal { get; set; }
    }
}
