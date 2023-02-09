
using Helpers;
using Domain.Models;
using Domain.Models.Almacen;
using Domain.ViewModels.Almacen;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace DataAccess.Almacen
{
    public class FamiliaDao : ConnectionDb
    {
        protected GenericResponse _response;

        public FamiliaDao()
        {
            _response = new GenericResponse();
        }
        //Operaciones Especiales 
        public async Task<GenericResponse> OptionAsync(int idRol)
        {
            var listar = new List<Familia>();
            try
            {
                var cmd = new SqlCommand("aspFamiliaOption", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                SqlDataReader reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    _response.id = reader.GetString(0);
                    if (_response.id == "1")
                    {
                        var f = new Familia
                        {
                            idFamilia = reader.GetInt32(1),
                            descripcion = reader.GetString(2)
                        };
                        listar.Add(f);
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