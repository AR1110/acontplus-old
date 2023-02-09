
using Helpers;
using Domain.Models;
using Domain.ViewModels.Almacen;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace DataAccess.Almacen
{
    public class MarcaDao : ConnectionDb
    {
        protected GenericResponse _response;
        public MarcaDao()
        {
            _response= new GenericResponse();
        }

        //Operaciones Espciales
        public async Task<GenericResponse> OptionAsync(int idRol, int idMarca)
        {
            var listar = new List<Marca>();
            try
            {
                var cmd = new SqlCommand("ASPMarcaOption", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("idMarca", idMarca);
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                SqlDataReader reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    _response.id = reader.GetString(0);
                    if (_response.id == "1")
                    {
                        var m = new Marca
                        {
                            idMarca = reader.GetInt32(1),
                            descripcion = reader.GetString(2)
                        };
                        listar.Add(m);
                    }
                }

                _response.data = listar;
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message.ToString();
            }
            finally
            {
                con.Close();
            }
            return _response;
        }
    }
}