namespace Inventory.Api.Controllers;

public class ProductPhotoController(
    IProductPhotoRepository productPhoto,
    IS3StorageService storageService,
    S3ObjectCustom s3ObjectCustom)
    : BaseApiController
{
  private const string IdCardCompany = "idCardCompany";
  private const string BucketDirectory = "/articulos/";

  [HttpGet("{productId}")]
  public async Task<IActionResult> Get(int productId)
  {
    var response = await productPhoto.GetAsync(productId);
    return response == null ? BadRequest($"Cant get data: {productId}") : Ok(response);
  }

  [HttpPost("{productId}")]
  public async Task<IActionResult> Post(int productId, IFormFile file)
  {
    var data = new ProductPhoto
    {
      CreatedByUserId = User.GetUserId(),
      Id = 0,
      S3ObjectKey = string.Empty,
      S3ObjectUrl = string.Empty
    };
    if (file != null)
      await s3ObjectCustom.Initialize($"{User.GetClaimValue<string>(IdCardCompany)}{BucketDirectory}", file);

    data.ProductId = productId;
    data.S3ObjectKey = s3ObjectCustom.S3ObjectKey;
    data.S3ObjectUrl = s3ObjectCustom.S3ObjectUrl;
    var response = await productPhoto.AddAsync(data);
    if (response.Code == "1" && file != null)
    {
      var s3Response = await storageService.UploadAsync(s3ObjectCustom);
    }

    return Ok(response);
  }

  [HttpPost("Put/{id}")]
  public async Task<IActionResult> Put(int id, string json, IFormFile file)
  {
    var data = new ProductPhoto
    {
      Id = 0,
      S3ObjectKey = string.Empty,
      S3ObjectUrl = string.Empty
    };
    data = JsonExtensions.DeserializeOptimized<ProductPhoto>(json);
    data.UpdatedByUserId = User.GetUserId();
    if (file != null)
      await s3ObjectCustom.Initialize($"{User.GetClaimValue<string>(IdCardCompany)}{BucketDirectory}", file);
    data.S3ObjectKey = s3ObjectCustom.S3ObjectKey;
    data.S3ObjectUrl = s3ObjectCustom.S3ObjectUrl;
    var response = await productPhoto.UpdateAsync(id, data);
    if (response.Code == "1" && file != null)
    {
      var s3Response = await storageService.UpdateAsync(s3ObjectCustom);
    }

    return Ok(response);
  }

  [HttpPut("SetDefault/{id}/{isDefault}")]
  public async Task<IActionResult> Put(int id, bool isDefault)
  {
    var response = await productPhoto.SetDefaultAsync(id, isDefault, User.GetUserId());
    return Ok(response);
  }

  [HttpDelete("{id}")]
  public async Task<IActionResult> Delete(int id)
  {
    var response = await productPhoto.DeleteAsync(id, User.GetUserId());
    if (response.Code == "1")
    {
      await s3ObjectCustom.Initialize(response.Payload);
      var s3Response = await storageService.DeleteAsync(s3ObjectCustom);
    }

    return Ok(response);
  }
}
