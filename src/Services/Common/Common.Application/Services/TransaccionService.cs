using Common.Core.Interfaces;

namespace Common.Application.Services
{
    public class TransaccionService : ITransaccionService
    {
        private readonly IADORepository _repository;
        public TransaccionService(IADORepository repository)
        {
            _repository = repository;
        }
        public void Process(Dictionary<string, object> parameters)
        {
            _repository.OnlyExecute("dbo.Transaccion_Handler_Init", parameters);
        }
    }
}
