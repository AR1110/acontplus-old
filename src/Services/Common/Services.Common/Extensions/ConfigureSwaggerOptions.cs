using System.Reflection;
using Asp.Versioning.ApiExplorer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Services.Common.Extensions;

public class ConfigureSwaggerOptions(IApiVersionDescriptionProvider provider)
    : IConfigureNamedOptions<SwaggerGenOptions>
{
    /// <summary>
    ///     Configure each API discovered for Swagger Documentation
    /// </summary>
    /// <param name="options"></param>
    public void Configure(SwaggerGenOptions options)
    {
        // add swagger document for every API version discovered
        foreach (var description in provider.ApiVersionDescriptions)
        {
            options.SwaggerDoc(
                description.GroupName,
                CreateVersionInfo(description));
        }
    }

    /// <summary>
    ///     Configure Swagger Options. Inherited from the Interface
    /// </summary>
    /// <param name="name"></param>
    /// <param name="options"></param>
    public void Configure(string name, SwaggerGenOptions options)
    {
        Configure(options);
    }

    /// <summary>
    ///     Create information about the version of the API
    /// </summary>
    /// <param name="description"></param>
    /// <param name="desc"></param>
    /// <returns>Information about the API</returns>
    private OpenApiInfo CreateVersionInfo(
        ApiVersionDescription desc)
    {
        var assembly = Assembly.GetEntryAssembly();

        // Get the name of the assembly
        var assemblyName = assembly?.GetName().Name;

        var info = new OpenApiInfo { Title = $"{assemblyName}", Version = desc.ApiVersion.ToString() };

        if (desc.IsDeprecated)
        {
            info.Description +=
                " This API version has been deprecated. Please use one of the new APIs available from the explorer.";
        }

        return info;
    }
}
