using Helpers;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace DataAccess.Ventas
{
    public class EstadisticaVentaDao : ConnectionDb
    {
        public async Task<string> GetAsync(string json)
        {
            DataTable dt = new DataTable();
            string response = "";
            try
            {
                using (SqlCommand cmd = new SqlCommand("ASPReporteVentaEstadistica", con))
                {
                    cmd.Parameters.AddWithValue("json", json);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataAdapter dataAdapter = new SqlDataAdapter(cmd);
                    dataAdapter.Fill(dt);
                    if (dt.Rows.Count > 0)
                    {
                        response = DataHelper.DataTableToJSON(dt);
                    }
                    dataAdapter.Dispose();
                }
            }
            catch (Exception ex)
            {
                _ = ex.Message;
            }
            finally
            {
                con.Close();
            }
            return response;
        }
    }
}
