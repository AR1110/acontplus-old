using FactElect.API.Entities;

namespace FactElect.API.Controllers.Customer;

public class CustomersController(ICustomerService customerService) : BaseApiController
{
    // GET: api/Customers
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        return Ok(await customerService.GetAsync(new Dictionary<string, object>()));
    }

    // GET: api/Customers/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        return Ok(await customerService.GetAsync(new Dictionary<string, object>()));
    }

    // PUT: api/Customers/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, AppCustomer appCustomer)
    {
        appCustomer.UserId = User.GetUserId();
        return Ok(await customerService.UpdateAsync(id, appCustomer));
    }

    // POST: api/Customers
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<AppCustomer>> Post(AppCustomer appCustomer)
    {
        appCustomer.UserId = User.GetUserId();
        return Ok(await customerService.AddAsync(appCustomer));
    }

    // DELETE: api/Customers/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        return Ok(await customerService.DeleteAsync(User.GetUserId(), id));
    }
}
