namespace Inventario.API.Controllers;

public class ProductPhotoController : BaseApiController
{

    private readonly IProductPhotoService _productPhoto;
    private readonly S3ObjectCustom _s3ObjectCustom;
    private readonly IS3StorageService _storageService;

    public ProductPhotoController(IProductPhotoService productPhoto,
        IS3StorageService storageService,
        S3ObjectCustom s3ObjectCustom,
        ICustomLogger log)
    {
        _productPhoto = productPhoto;
        _storageService = storageService;
        _s3ObjectCustom = s3ObjectCustom;

    }

    [HttpGet("{productId}")]
    public async Task<IActionResult> Get(int productId)
    {
        var response = await _productPhoto.GetAsync(productId);
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
            await _s3ObjectCustom.Add($"{User.GetIdCardCompany()}/articulos/", file);
        }

        data.ProductId = productId;
        data.S3ObjectKey = _s3ObjectCustom.S3ObjectKey;
        data.S3ObjectUrl = _s3ObjectCustom.S3ObjectUrl;
        var response = await _productPhoto.AddAsync(data);
        if (response.code == "1" && file != null)
        {
            var s3Response = await _storageService.UploadAsync(_s3ObjectCustom);
            _s3ObjectCustom.Dispose();
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
            await _s3ObjectCustom.Add($"{User.GetIdCardCompany()}/articulos/", file, data.S3ObjectKey,
                data.S3ObjectUrl);
        }

        var response = await _productPhoto.UpdateAsync(id, data);
        if (response.code == "1" && file != null)
        {
            var s3Response = await _storageService.UpdateAsync(_s3ObjectCustom);
            _s3ObjectCustom.Dispose();
        }

        return Ok(response);
    }

    [HttpPut("SetDefault/{id}/{isDefault}")]
    public async Task<IActionResult> Put(int id, bool isDefault)
    {

        var response = await _productPhoto.SetDefaultAsync(id, isDefault, User.GetUserId());
        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var response = await _productPhoto.DeleteAsync(id, User.GetUserId());
        if (response.code == "1")
        {
            _s3ObjectCustom.Add(response.payload);
            var s3Response = await _storageService.DeleteAsync(_s3ObjectCustom);
            _s3ObjectCustom.Dispose();
        }

        return Ok(response);
    }
}
