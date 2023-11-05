using System.Data;
using Common.Core.Models;
using Common.Core.Utils;
using Domain.Models.GestionFinanciera;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace DataAccess.GestionFinanciera
{
    public class MovimientoCajaDao
    {
        private GenericResponse _gr;

        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public MovimientoCajaDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _gr = new GenericResponse();
        }

        public async Task<GenericResponse> GetAsync(int idRol, string json)
        {
            DataTable dt = new DataTable();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("aspMovimientoCajaGet", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("json", json);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataAdapter dataAdapter = new SqlDataAdapter(cmd);
                    dataAdapter.Fill(dt);
                    if (dt.Rows.Count > 0)
                    {
                        _gr.id = "1";
                        _gr.data = DataConverters.DataTableToJSON(dt);
                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Listar Movimiento de Caja";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> InsertAsync(int idRol, MovimientoCaja data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPMovimientoCajaInsert", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("codEstab", data.codEstab);
                    cmd.Parameters.AddWithValue("idTipoDocumento", data.idTipoDocumento);
                    cmd.Parameters.AddWithValue("idEmpleado", data.idEmpleado);
                    cmd.Parameters.AddWithValue("idSubEntidadFinanciera", data.idSubEntidadFinanciera);
                    cmd.Parameters.AddWithValue("idCaja", data.idCaja);
                    cmd.Parameters.AddWithValue("valor", data.valor);
                    cmd.Parameters.AddWithValue("observaciones", DataValidation.ToDBNullOrDefault(data.observaciones));
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = reader.GetString(1);
                        _gr.titleSms = reader.GetString(2);

                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Registrar MovimientoCaja";
            }
            finally
            {

            }
            return _gr;
        }

    }
}
