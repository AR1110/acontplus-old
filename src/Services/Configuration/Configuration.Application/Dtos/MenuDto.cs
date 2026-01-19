namespace Configuration.Application.Dtos;

public class MenuDto
{
    public int? Id { get; set; }
    public int ApplicationId { get; set; }
    public required string Code { get; set; }
    public required string Icon { get; set; }
    public required string Name { get; set; }
    public int Order { get; set; }
    public required string Url { get; set; }
    public int? ParentId { get; set; }
    public int? CreatedByUserId { get; set; }
    public int? UpdatedByUserId { get; set; }
}
