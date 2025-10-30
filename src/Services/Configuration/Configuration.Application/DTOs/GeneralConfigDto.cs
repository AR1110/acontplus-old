namespace Configuration.Application.DTOs
{
    public class GeneralConfigDto
    {
        public record UpdateGeneralConfigDto
        {
            public int IdSistema { get; set; }
            public required string JsonConfig { get; set; }
        }

    }
}

