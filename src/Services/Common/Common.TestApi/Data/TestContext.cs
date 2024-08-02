using Microsoft.EntityFrameworkCore;

namespace Common.TestApi;

public class TestContext : DbContext
{
    public TestContext(DbContextOptions<TestContext> options) : base(options)
    {
    }
}
