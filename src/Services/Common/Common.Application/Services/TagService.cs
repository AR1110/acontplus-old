namespace Common.Application.Services;

public class TagService(IUnitOfWork unitOfWork, IMapper mapper, ILogger<TagService> logger) : ITagService
{
    private readonly IRepository<Tag> _tagRepository = unitOfWork.GetRepository<Tag>();
    private readonly IMapper _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    private readonly ILogger<TagService> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    public async Task<Result<TagItem, DomainError>> AddAsync(TagCreate request, int createdByUserId, CancellationToken cancellationToken = default)
    {
        await using (var transaction = await unitOfWork.BeginTransactionAsync())
        {
            try
            {
                var tag = _mapper.Map<TagCreate, Tag>(request);
                tag.CreatedByUserId = createdByUserId;

                await _tagRepository.AddAsync(tag);
                await unitOfWork.SaveChangesAsync();
                await transaction.CommitAsync();

                var response = _mapper.Map<Tag, TagItem>(tag);
                return Result<TagItem, DomainError>.Success(response);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error adding tag");
                return Result<TagItem, DomainError>.Failure(DomainError.Internal("TAG_ADD_ERROR", ex.Message));
            }
        }
    }

    public async Task<Result<TagItem, DomainError>> UpdateAsync(int id, TagUpdate request, int updatedByUserId, CancellationToken cancellationToken = default)
    {
        var tagFound = await _tagRepository.GetByIdAsync(id);
        if (tagFound != null)
        {
            _mapper.Map(request, tagFound);
            tagFound.UpdatedByUserId = updatedByUserId;

            await using (var transaction = await unitOfWork.BeginTransactionAsync())
            {
                try
                {
                    await _tagRepository.UpdateAsync(tagFound);
                    await unitOfWork.SaveChangesAsync();
                    await transaction.CommitAsync();

                    var response = _mapper.Map<Tag, TagItem>(tagFound);
                    return Result<TagItem, DomainError>.Success(response);
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    _logger.LogError(ex, "Error updating tag with ID {Id}", id);
                    return Result<TagItem, DomainError>.Failure(DomainError.Internal("TAG_UPDATE_ERROR", ex.Message));
                }
            }
        }

        return Result<TagItem, DomainError>.Failure(DomainError.NotFound("TAG_NOT_FOUND", "Item not found"));
    }

    public async Task<Result<bool, DomainError>> DeleteAsync(int id)
    {
        var tagFound = await _tagRepository.GetByIdAsync(id);
        if (tagFound != null)
        {
            await using (var transaction = await unitOfWork.BeginTransactionAsync())
            {
                try
                {
                    await _tagRepository.DeleteAsync(tagFound);
                    await unitOfWork.SaveChangesAsync();
                    await transaction.CommitAsync();
                    return Result<bool, DomainError>.Success(true);
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    _logger.LogError(ex, "Error deleting tag with ID {Id}", id);
                    return Result<bool, DomainError>.Failure(DomainError.Internal("TAG_DELETE_ERROR", ex.Message));
                }
            }
        }

        return Result<bool, DomainError>.Failure(DomainError.NotFound("TAG_NOT_FOUND", "Item not found"));
    }

    public async Task<Result<dynamic, DomainError>> GetAsync()
    {
        try
        {
            var tags = await _tagRepository.GetAllAsync();
            return !tags.Any()
                ? Result<dynamic, DomainError>.Failure(DomainError.NotFound("TAG_NOT_FOUND", "No tags found"))
                : Result<dynamic, DomainError>.Success(tags);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving tags");
            return Result<dynamic, DomainError>.Failure(DomainError.Internal("TAG_GET_ERROR", ex.Message));
        }
    }
}