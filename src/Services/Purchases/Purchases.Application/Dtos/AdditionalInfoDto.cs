namespace Purchases.Application.Dtos
{
    public record AdditionalInfoDto
    {
        public required int AdditionalInfoId { get; set; }
        public required int ArticleId { get; set; }
        public required int TagId { get; set; }
        public required string AdditionalDataJson { get; set; }
    }
}
