using MapsterMapper;

namespace Identity.Api.Services;

public class LicenseAccessDetailService(IUnitOfWork unitOfWork, IMapper mapper) : ILicenseAccessDetailService
{
    private readonly IRepository<LicenseAccessDetails> _licenseAccessDetailRepository = unitOfWork.GetRepository<LicenseAccessDetails>();
    private readonly IAdoRepository _adoRepository = unitOfWork.AdoRepository;
    private readonly IMapper _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    private const string ModuleName = "Seguridad.LicenciaAccesoDetalle";

    public async Task<Result<LicenseAccessDetails, DomainError>> AddAsync(LicenseAccessDetailCreate request)
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted);
        try
        {
            var licenseAccessDetail = _mapper.Map<LicenseAccessDetailCreate, LicenseAccessDetails>(request);
            if (licenseAccessDetail == null)
                return Result<LicenseAccessDetails, DomainError>.Failure(DomainError.Validation("INVALID_DATA", "No se recibieron datos"));

            var existingItems = await _licenseAccessDetailRepository.GetAllAsync();
            if (existingItems.Any(x => x.LicenciaAccesoId == licenseAccessDetail.LicenciaAccesoId && x.MenuId == licenseAccessDetail.MenuId))
                return Result<LicenseAccessDetails, DomainError>.Failure(DomainError.Validation("DUPLICATE_RECORD", "El registro ya existe"));

            await _licenseAccessDetailRepository.AddAsync(licenseAccessDetail);
            await unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();
            return Result<LicenseAccessDetails, DomainError>.Success(licenseAccessDetail);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return Result<LicenseAccessDetails, DomainError>.Failure(DomainError.Internal("LICENSE_ACCESS_DETAIL_ADD_ERROR", ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> DeleteAsync(int id)
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted);
        try
        {
            var detailFound = await _licenseAccessDetailRepository.GetByIdAsync(id);
            if (detailFound == null)
                return Result<bool, DomainError>.Failure(DomainError.NotFound("LICENSE_ACCESS_DETAIL_NOT_FOUND", "Registro no encontrado"));

            await _licenseAccessDetailRepository.DeleteAsync(detailFound);
            await unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();
            return Result<bool, DomainError>.Success(true);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return Result<bool, DomainError>.Failure(DomainError.Internal("LICENSE_ACCESS_DETAIL_DELETE_ERROR", ex.Message));
        }
    }

    public async Task<Result<dynamic, DomainError>> GetAsync(Dictionary<string, object> parameters)
    {
        try
        {
            var response = await _adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}_Get", parameters);
            return response == null
                ? Result<dynamic, DomainError>.Failure(DomainError.NotFound("LICENSE_ACCESS_DETAIL_NOT_FOUND", "No se encontraron datos"))
                : Result<dynamic, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            return Result<dynamic, DomainError>.Failure(DomainError.Internal("LICENSE_ACCESS_DETAIL_GET_ERROR", ex.Message));
        }
    }

    public async Task<Result<LicenseAccessDetails, DomainError>> UpdateAsync(int id, LicenseAccessDetailUpdate request)
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted);
        try
        {
            var detailFound = await _licenseAccessDetailRepository.GetByIdAsync(id);
            if (detailFound == null)
                return Result<LicenseAccessDetails, DomainError>.Failure(DomainError.NotFound("LICENSE_ACCESS_DETAIL_NOT_FOUND", "Registro no encontrado"));

            var licenseAccessDetail = _mapper.Map<LicenseAccessDetailUpdate, LicenseAccessDetails>(request);

            detailFound.MenuId = licenseAccessDetail.MenuId;
            detailFound.Actions = licenseAccessDetail.Actions;
            detailFound.Order = licenseAccessDetail.Order;
            detailFound.IsActive = licenseAccessDetail.IsActive;
            detailFound.UpdatedByUserId = licenseAccessDetail.UpdatedByUserId;
            await _licenseAccessDetailRepository.UpdateAsync(detailFound);
            await unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();
            return Result<LicenseAccessDetails, DomainError>.Success(detailFound);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return Result<LicenseAccessDetails, DomainError>.Failure(DomainError.Internal("LICENSE_ACCESS_DETAIL_UPDATE_ERROR", ex.Message));
        }
    }
}
