namespace Billing.Api.Controllers.Customer;

public class CustomerController(ICustomerService customerService) : BaseApiController
{
    //[HttpGet]
    //public async Task<IActionResult> Get()
    //{
    //    return Ok(await customerService.GetAsync(new Dictionary<string, object>()));
    //}

    //[HttpGet("{id}")]
    //public async Task<IActionResult> GetById(int id)
    //{
    //    return Ok(await customerService.GetAsync(new Dictionary<string, object>()));
    //}

    //[HttpPut("{id}")]
    //public async Task<IActionResult> Put(int id, AppCustomer appCustomer)
    //{
    //    appCustomer.UpdatedByUserId = User.GetUserId();
    //    return Ok(await customerService.UpdateAsync(id, appCustomer));
    //}

    //[HttpPost]
    //public async Task<ActionResult<AppCustomer>> Post(AppCustomer appCustomer)
    //{
    //    appCustomer.CreatedByUserId = User.GetUserId();
    //    return Ok(await customerService.AddAsync(appCustomer));
    //}

    //[HttpDelete("{id}")]
    //public async Task<IActionResult> Delete(int id)
    //{
    //    return Ok(await customerService.DeleteAsync(User.GetUserId(), id));
    //}
}
