namespace TechnicalSupport.API.Services
{
    public class ModeloService : IModeloService
    {
        private readonly IADORepository _repository;
        private readonly TechnicalSupportContext _context;

        public ModeloService(TechnicalSupportContext context, IADORepository repository)
        {
            _context = context;
            _repository = repository;
        }
        public async Task<ApiResponse> AddAsync(Modelo modelo)
        {
            try
            {
                if (await _context.Modelos.AnyAsync(x => x.Code == modelo.Code))
                {
                    return new ApiResponse { code = "0", message = "Este código ya se encuentra registrado" };
                }
                modelo.SerieId = modelo.SerieId == 0 ? null : modelo.SerieId;
                _context.Modelos.Add(modelo);
                await _context.SaveChangesAsync();
                return new ApiResponse { code = "1", message = "Guardado Exitosamente" };
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<ApiResponse> DeleteAsync(int userId, int id)
        {
            try
            {
                var modelo = await _context.Modelos.FindAsync(id);
                modelo.Enabled = false;
                modelo.Deleted = true;
                modelo.UserId = userId;
                _context.Update(modelo);
                await _context.SaveChangesAsync();
                return new ApiResponse { code = "1", message = "Eliminado Exitosamente" };
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
        {
            try
            {
                if (!await _context.Modelos.AnyAsync())
                {
                    return new ApiResponse { code = "0", message = "No data" };
                }
                //var modelos = await _context.Modelos
                //    .Include(m => m.Brand)
                //    .ThenInclude(b => b.Category)
                //    .Select(m => new
                //    {
                //        m.Id,
                //        m.Code,
                //        m.Name,
                //        m.BrandId,
                //        m.SerieId,
                //        BrandCode = m.Brand.Code,
                //        BrandName = m.Brand.Name,
                //        CategoryCode = m.Brand.Category.Code,
                //        CategoryName = m.Brand.Category.Name
                //    })
                //    .ToListAsync();
                //return new ApiResponse { code = "1", payload = DataConverters.SerializeObjectCustom<List<Modelo>>(modelos) };

                var dt = await _repository.GetDataTableAsync("TechnicalSupport.Modelo_Get", parameters);
                if (DataValidation.DataTableIsNull(dt))
                {
                    return new ApiResponse { code = "0", message = "No data" };
                }
                return new ApiResponse { code = "1", payload = DataConverters.DataTableToJSON(dt) };
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<ApiResponse> UpdateAsync(int id, Modelo modelo)
        {
            try
            {
                var modeloFound = await _context.Modelos.FindAsync(id);
                modeloFound.Code = modelo.Code;
                modeloFound.Enabled = modelo.Enabled;
                modeloFound.Name = modelo.Name;
                modeloFound.UserId = modelo.UserId;
                modeloFound.SerieId = modelo.SerieId;
                _context.Update(modeloFound);
                await _context.SaveChangesAsync();
                return new ApiResponse { code = "1", message = "Actualizado Exitosamente" };
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
