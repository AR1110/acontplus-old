using Helpers;
using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;
using System.IO;
namespace DataAccess
{
    //SE DEBE ELIMINAR ESTA CLASE Y CONSULTAR DBACCESS
    public class ConnectionDb
    {
        public static SqlConnection GetSqlConnection()
        {
            IConfigurationRoot root = getAppSettings();
            var connDecrypted = Encryption.DecryptString(root.GetSection("keyEncrypt").Value, root.GetConnectionString("AcontPlus"));
            SqlConnection conn = new SqlConnection(connDecrypted);
            return conn;
        }
        //SE DEBE QUITAR ESTO
        public SqlConnection con = GetSqlConnection();

        public static IConfigurationRoot getAppSettings()
        {
            string connectionStrings = string.Empty;
            string env = string.Empty;
#if DEBUG
            env = "Development";
#else
            env = "Production";
#endif
            IConfigurationBuilder builder = new ConfigurationBuilder();
            builder.AddJsonFile(Path.Combine(Directory.GetCurrentDirectory(), $"appsettings.{env}.json"), reloadOnChange: true, optional: false);

            IConfigurationRoot root = builder.Build();
            return root;
        }
    }
}