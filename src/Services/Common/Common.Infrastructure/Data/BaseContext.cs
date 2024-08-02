namespace Common.Infrastructure.Data;

public class BaseContext(DbContextOptions options) : DbContext(options);
