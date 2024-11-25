using Microsoft.EntityFrameworkCore;

namespace Common.TestApi.Data;

public class TestContext : DbContext
{
    public TestContext(DbContextOptions<TestContext> options) : base(options)
    {
    }
}
