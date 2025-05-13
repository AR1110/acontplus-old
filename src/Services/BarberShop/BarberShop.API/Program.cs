using BarberShop.API.Extensions;
using BarberShop.API.Extensions.Endpoints;
using Common.Services.Configuration;
using Common.Services.Middleware;

var builder = WebApplication.CreateBuilder(args);

var configuration = AppConfiguration.Load();
builder.Configuration.AddConfiguration(configuration);

builder.Services.AddApplicationServices(builder.Configuration);

builder.Services.AddIdentityService(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseResponseCompression();

app.UseMiddleware<ExceptionMiddleware>();

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapTicketEndpoints();

await app.RunAsync();
