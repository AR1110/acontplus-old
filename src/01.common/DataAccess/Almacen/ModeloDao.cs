
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
    public class ModeloDao : ConnectionDb
    {
        protected GenericResponse _gr;
        public ModeloDao()
        {
            _gr= new GenericResponse();
        }
      
        public async Task<GenericResponse> OptionAsync(int idRol)
        {
            var listar = new List<ModeloViewModel>();
            try
            {
                var cmd = new SqlCommand("ASPModeloOption", con);

                cmd.Parameters.AddWithValue("idRol", idRol);                
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                SqlDataReader reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    _gr.id = reader.GetString(0);
                    if (_gr.id == "1")
                    {
                        var m = new ModeloViewModel
                        {
                            modelo = new Modelo()
                            {
                                idModelo = reader.GetInt32(1),
                                descripcion = reader.GetString(2),
                                idMarca = reader.GetInt32(3),
                            },
                            nombreMarca = reader.GetString(4)
                        };
                        listar.Add(m);
                    }

                }
                _gr.data = listar;
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