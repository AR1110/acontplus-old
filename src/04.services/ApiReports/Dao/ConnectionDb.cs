using System.Configuration;
using System.Data.SqlClient;

namespace ApiReports.Dao
{
    public class ConnectionDb
    {
#if DEBUG
        protected SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["AcontPlusDev"].ConnectionString);
#else
        protected SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["AcontPlusProd"].ConnectionString);
#endif
    }
}