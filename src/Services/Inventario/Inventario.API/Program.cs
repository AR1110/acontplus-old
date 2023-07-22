using Inventario.API.Extensions;
using Lib.Common;
using Services.Common;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Configuration.SetBasePath(DirHelper.GetBinRunDir());
ConfigHelper.AddJsonFiles(builder.Configuration);

builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddCustomJwtAuthentication(builder.Configuration);

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddSwaggerDocumentation();

var app = builder.Build();

app.UseSwaggerDocumentation();

app.UseRouting();

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers().RequireAuthorization();

app.UseEndpoints(endpoints =>
{
    endpoints.MapGet("/", context => {
        context.Response.Redirect("swagger");
        return Task.CompletedTask;
    });
});

app.Run();
