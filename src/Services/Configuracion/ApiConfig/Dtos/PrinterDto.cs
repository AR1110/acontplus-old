namespace ApiConfig.Dtos
{
    public class PrinterDto
    {
        public string machine { get; set; }
        public string driverName { get; set; }
        public string name { get; set; }
        public bool isDefault { get; set; }
        public bool isThermal { get; set; }
        public int copyPrint { get; set; }
        public string rdlcName { get; set; }
        public string deviceInfo { get; set; }
        public string formato { get; set; }
        public bool hasParams { get; set; }
    }
}
