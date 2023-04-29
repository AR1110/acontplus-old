namespace Domain.Dtos
{
    public class ApiReportParamsDto
    {
        public int idRol { get; set; }
        public bool hasIdUsuarioRol { get; set; }
        public bool hasService { get; set; }
        public string reportParams { get; set; }
        public string dataParams { get; set; }
        public string claveAcceso { get; set; }
        public bool isReportDynamic { get; set; }
        public bool sendEmail { get; set; }
        public Dictionary<string, string> parameters { get; set; }
        public Dictionary<string, string> rdlcProps { get; set; }
        public Dictionary<string, List<Dictionary<string, string>>> dataSources { get; set; }
        public Dictionary<string, string> rdlcParams { get; set; }
    }
}
