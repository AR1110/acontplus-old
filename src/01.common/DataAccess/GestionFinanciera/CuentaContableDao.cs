using Domain.Models;
using Domain.Models.GestionFinanciera;
using Helpers;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.GestionFinanciera
{
    public class CuentaContableDao : ConnectionDb
    {
        private GenericResponse _gr;
        public CuentaContableDao()
        {
            _gr = new GenericResponse();
        }

        public async Task<GenericResponse> InsertAsync(int idRol, CuentaBancaria data)
        {
            try
            {
                var cmd = new SqlCommand("ASPCuentaBancariaInsert", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
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
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Registrar Cuenta Bancaria";
            }
            finally
            {
                con.Close();
            }
            return _gr;
        }
    }
}
