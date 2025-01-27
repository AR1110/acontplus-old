namespace Inventario.API.Controllers;

public class ProductPhotoController(
    IProductPhotoService productPhoto,
    IS3StorageService storageService,
    S3ObjectCustom s3ObjectCustom)
    : BaseApiController
{
    [HttpGet("{productId}")]
    public async Task<IActionResult> Get(int productId)
    {
        var response = await productPhoto.GetAsync(productId);
        if (response == null) { return BadRequest($"Cant get data: {productId}"); }

        return Ok(response);
    }

    [HttpPost("{productId}")]
    public async Task<IActionResult> Post(int productId, IFormFile file)
    {
        var data = new ProductPhoto();
        data.UserId = User.GetUserId();
        if (file != null)
        {
            await s3ObjectCustom.Add($"{User.GetIdCardCompany()}/articulos/", file);
        }

        data.ProductId = productId;
        data.S3ObjectKey = s3ObjectCustom.S3ObjectKey;
        data.S3ObjectUrl = s3ObjectCustom.S3ObjectUrl;
        var response = await productPhoto.AddAsync(data);
        if (response.code == "1" && file != null)
        {
            var s3Response = await storageService.UploadAsync(s3ObjectCustom);
            s3ObjectCustom.Dispose();
        }

        return Ok(response);
    }

    [HttpPost("Put/{id}")]
    public async Task<IActionResult> Put(int id, string json, IFormFile file)
    {
        var data = new ProductPhoto();
        data = JsonConvert.DeserializeObject<ProductPhoto>(json);
        data.UserId = User.GetUserId();
        if (file != null)
        {
            await s3ObjectCustom.Add($"{User.GetIdCardCompany()}/articulos/", file);
        }
        data.S3ObjectKey = s3ObjectCustom.S3ObjectKey;
        data.S3ObjectUrl = s3ObjectCustom.S3ObjectUrl;
        var response = await productPhoto.UpdateAsync(id, data);
        if (response.code == "1" && file != null)
        {
            var s3Response = await storageService.UpdateAsync(s3ObjectCustom);
            s3ObjectCustom.Dispose();
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
        if (response.code == "1")
        {
            s3ObjectCustom.Add(response.payload);
            var s3Response = await storageService.DeleteAsync(s3ObjectCustom);
            s3ObjectCustom.Dispose();
        }

        return Ok(response);
    }
}
