using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Common.Infrastructure.Repository;
using Lib.Common;
using TechnicalSupport.Core.Entities;
using TechnicalSupport.Core.Interfaces;
using TechnicalSupport.Infrastructure.Data;

namespace TechnicalSupport.Application.Services
{
    public class OrderService : IOrderService
    {
        private readonly TechnicalSupportContext _context;
        private readonly IADORepository _repository;
        public OrderService(TechnicalSupportContext context, IADORepository repository)
        {
            _context = context;
            _repository = repository;
        }
        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("TechnicalSupport.Order_Get", parameters);
            if (ds.Tables[0].Rows.Count == 0)
            {
                return null;
            }
            else
            {
                return Converters.DataSetToJSON(ds);
            }
        }
        public async Task<string> AddAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync("TechnicalSupport.Order_Insert", parameters);
        }
        public async Task<string> UpdateAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync("TechnicalSupport.Order_Update", parameters);
        }
        public async Task<bool> DeleteAsync(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return false;
            order.Enabled = false;
            order.Deleted = true;

            _context.Orders.Update(order);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
