using Domain.Models;
using Helpers;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace DataAccess.Aplicacion
{
    public class PlanClienteDao : ConnectionDb
    {
        protected GenericResponse _response;
        public PlanClienteDao()
        {
            _response = new GenericResponse();
        }

        public async Task<GenericResponse> UpdateAsync(string ruc, string codigo)
        {
            try
            {
                using (SqlCommand cmd = new SqlCommand("App.aspPlanCliente_Update", con))
                {
                    cmd.Parameters.AddWithValue("ruc", ruc);
                    cmd.Parameters.AddWithValue("codigo", codigo);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = await cmd.ExecuteReaderAsync();
                    while (await reader.ReadAsync())
                    {
                        _response.id = reader.GetString(0);
                        _response.message = reader.GetString(1);
                        _response.titleSms = reader.GetString(2);
                    }
                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message.ToString();
                _response.titleSms = "Editar PlaCliente";
            }
            finally
            {
                con.Close();
            }
            return _response;
        }
    }
}
