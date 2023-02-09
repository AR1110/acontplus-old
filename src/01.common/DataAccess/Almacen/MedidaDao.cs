using Domain.Models;
using Domain.Models.Almacen;
using Domain.ViewModels.Almacen;
using Helpers;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace DataAccess.Almacen
{
    public class MedidaDao : ConnectionDb
    {
        protected GenericResponse _gr;

        public MedidaDao()
        {
            _gr = new GenericResponse();
        }
        public async Task<GenericResponse> GetByMedida(int idRol)
        {
            var list = new List<Medida>();
            try
            {
                var cmd = new SqlCommand("ASPMedidaGetBy", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    _gr.id = reader.GetString(0);
                    _gr.message = reader.GetString(1);
                    if (_gr.id == "1")
                    {
                        var m = new Medida
                        {
                            idMedida = reader.GetInt32(2),
                            descripcion = reader.GetString(3)
                        };
                        list.Add(m);
                    }
                }
                _gr.data = list;

            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
            }
            finally
            {

                con.Close();
            }
            return _gr;
        }
    }
}