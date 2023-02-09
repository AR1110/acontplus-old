using Helpers;
using Domain.Models;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace DataAccess
{
    public class CodigoEnvioSriDao : ConnectionDb
    {
        private GenericResponse _gr;
        public CodigoEnvioSriDao()
        {
            _gr = new GenericResponse();
        }
        public async Task<GenericResponse> GetAsync()
        {
            DataTable dt = new DataTable ();
            try
            {
                var cmd = new SqlCommand("Sri.aspCodigoEnvioSriGet", con);
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                SqlDataAdapter dataAdapter = new SqlDataAdapter (cmd);
                dataAdapter.Fill(dt);
                if (dt.Rows.Count > 0)
                {
                    _gr.id = "1";
                    _gr.data = DataHelper.DataTableToJSON(dt);
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Get Codigos";
            }
            finally
            {
                con.Close();
            }
            return _gr;
        }
    }
}
