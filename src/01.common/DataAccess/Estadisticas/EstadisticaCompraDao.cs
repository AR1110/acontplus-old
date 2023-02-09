using Helpers;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace DataAccess.Estadisticas
{
    public class EstadisticaCompraDao : ConnectionDb
    {
        public async Task<string> GetAsync(string json)
        {
            DataTable _dt = new DataTable();
            var response = "";
            try
            {
                SqlCommand cmd = new SqlCommand("aspReporteCompraEstadistica", con);
                cmd.Parameters.AddWithValue("json", json);
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                SqlDataAdapter dataAdapter = new SqlDataAdapter(cmd);
                dataAdapter.Fill(_dt);
                if (_dt.Rows.Count > 0)
                {
                    response = DataHelper.DataTableToJSON(_dt);
                }
                dataAdapter.Dispose();

            }
            finally
            {
                con.Close();
            }

            return response;


        }
    }
}
