using Helpers;
using Domain.Models;
using Domain.Models.GestionFinanciera;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace DataAccess.GestionFinanciera
{
    public class CarteraDao : ConnectionDb
    {
        private GenericResponse _gr;

        public CarteraDao()
        {
            _gr = new GenericResponse();
        }

        public async Task<GenericResponse> GetIngresosAsync(int idRol, string json)
        {
            DataTable dt = new DataTable ();
            try
            {
                SqlCommand cmd = new SqlCommand("Ingresos.CarteraCliente_Get", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("json", json);
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
                _gr.titleSms = "Lisatar Cartera Cliente";
            }
            finally
            {
                con.Close();
            }
            return _gr;
        }
        public async Task<GenericResponse> GetEgresosAsync(int idRol, string json)
        {
            DataTable dt = new DataTable ();
            try
            {
                SqlCommand cmd = new SqlCommand("Egresos.CarteraProveedor_Get", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("json", json);
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
                _gr.titleSms = "Lisatar Cartera Proveedor";
            }
            finally
            {
                con.Close();
            }
            return _gr;
        }
    }
}
