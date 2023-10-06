using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TechnicalSupport.Core.Entities;
using TechnicalSupport.Core.Interfaces;
using TechnicalSupport.Infrastructure.Data;

namespace TechnicalSupport.Application.Services
{
    public class OrderService : IOrderService
    {
        private readonly TechnicalSupportContext _context;
        public OrderService(TechnicalSupportContext context)
        {
            _context = context;
        }
        public async Task<string> AddAsync(Order order)
        {
            if (order == null) { return null; };
             
            return "";
        }
    }
}
