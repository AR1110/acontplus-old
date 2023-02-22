using DataAccess;
using Domain.Models.Generic;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WS_Article_Inventory
{
    public sealed class InventoryService
    {
        private readonly IConfiguration _config;
        public InventoryService(IConfiguration config) => (_config) = (config);

        public async Task<DataTable> Get(int cantArticles)
        {
            DbAccess _dbAccess = new DbAccess(_config);
            await _dbAccess.SPExecute("Inventario.Control_Stock_Serv_Get");
            _dbAccess.AddDynamicParam("cantArticles", cantArticles);
            return _dbAccess.GetDataTable();
        }

        public async Task<bool> Delete(int id)
        {
            DbAccess _dbAccess = new DbAccess(_config);
            await _dbAccess.SPExecute("Inventario.Control_Stock_Serv_Delete");
            _dbAccess.AddDynamicParam("id", id);
            _dbAccess.OnlyExecute();
            return true;
        }

        public async Task<DataTable> GetDocument(int idArticulo)
        {
            DbAccess _dbAccess = new DbAccess(_config);
            await _dbAccess.SPExecute("Inventario.Control_Stock_Serv_Get_Document");
            _dbAccess.AddDynamicParam("idArticulo", idArticulo);
            return _dbAccess.GetDataTable();
        }

        public async Task<DataTable> GetMovement(string json)
        {
            DbAccess _dbAccess = new DbAccess(_config);
            await _dbAccess.SPExecute("Inventario.Control_Stock_Serv_Get_Movement");
            _dbAccess.AddDynamicParam("json", json);
            return _dbAccess.GetDataTable();
        }

        public async Task<bool> Update(int idArticulo, decimal stock)
        {
            DbAccess _dbAccess = new DbAccess(_config);
            await _dbAccess.SPExecute("Inventario.Control_Stock_Serv_Update_Stock");
            _dbAccess.AddDynamicParam("idArticulo", idArticulo);
            _dbAccess.AddDynamicParam("stock", stock);
            _dbAccess.OnlyExecute();
            return true;
        }

    }
}
