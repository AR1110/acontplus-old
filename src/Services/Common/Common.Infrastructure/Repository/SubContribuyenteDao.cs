using System.Data;
using Common.Core.Models;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace Common.Infrastructure.Repository
{
    public class SubContribuyenteDao
    {
        private readonly IConfiguration _config;
        protected ApiResponse _gr;
        private readonly string _connectionStrings = string.Empty;

        public SubContribuyenteDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _gr = new ApiResponse();

        }
       
        public async Task<ApiResponse> OptionSubContribuyenteAsync(int idRol)
        {
            var listar = new List<SubContribuyenteOperaciones>();
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    using (var cmd = new SqlCommand("ASPSubContribuyenteOption", con))
                    {
                        cmd.Parameters.AddWithValue("idRol", idRol);
                        cmd.CommandType = CommandType.StoredProcedure;
                        await con.OpenAsync();
                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                _gr.id = reader.GetString(0);
                                _gr.typeNotify = reader.GetString(1);
                                _gr.message = reader.GetString(2);
                                _gr.titleSms = reader.GetString(3);

                                if (_gr.id == "1")
                                {
                                    var sc = new SubContribuyenteOperaciones();

                                    sc.subContribuyente = new SubContribuyente()
                                    {
                                        idSubContribuyente = reader.GetInt32(4),
                                        descripcion = reader.GetString(5),
                                        codigo = reader.GetString(6),
                                        estado = reader.GetBoolean(7)
                                    };
                                    sc.tipoContribuyente = new TipoContribuyente()
                                    {
                                        idTipoContribuyente = reader.GetInt32(8),
                                        descripcion = reader.GetString(9)
                                    };
                                    listar.Add(sc);
                                }
                            }
                        }
                    }
                }
                _gr.data = listar;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.typeNotify = "warning";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "SubContribuyente Options";
            }
            return _gr;
        }
    }
}
