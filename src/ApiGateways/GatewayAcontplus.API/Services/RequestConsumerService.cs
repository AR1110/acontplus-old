//using RabbitMQ.Client.Events;
//using RabbitMQ.Client;
//using System.Text;
//using Newtonsoft.Json;
//using GatewayAcontplus.API.Entities;
//using GatewayAcontplus.API.Data;

//namespace GatewayAcontplus.API.Services;
//public class RequestConsumerService : BackgroundService
//{
//    private readonly IServiceScopeFactory _scopeFactory;
//    private readonly IConfiguration _configuration;
//    private IConnection _connection;
//    private IModel _channel;

//    public RequestConsumerService(IServiceScopeFactory scopeFactory, IConfiguration configuration)
//    {
//        _scopeFactory = scopeFactory;
//        _configuration = configuration;
//    }

//    protected override Task ExecuteAsync(CancellationToken stoppingToken)
//    {
//        var factory = new ConnectionFactory() { HostName = _configuration["RabbitMQ:HostName"] };
//        _connection = factory.CreateConnection();
//        _channel = _connection.CreateModel();
//        _channel.QueueDeclare(queue: _configuration["RabbitMQ:QueueName"],
//                              durable: true,
//                              exclusive: false,
//                              autoDelete: false,
//                              arguments: null);

//        var consumer = new EventingBasicConsumer(_channel);
//        consumer.Received += async (model, ea) =>
//        {
//            var body = ea.Body.ToArray();
//            var message = Encoding.UTF8.GetString(body);
//            var apiRequest = JsonConvert.DeserializeObject<ApiRequest>(message);

//            using (var scope = _scopeFactory.CreateScope())
//            {
//                var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
//                context.ApiRequests.Add(apiRequest);
//                await context.SaveChangesAsync();
//            }
//        };

//        _channel.BasicConsume(queue: _configuration["RabbitMQ:QueueName"],
//                              autoAck: true,
//                              consumer: consumer);

//        return Task.CompletedTask;
//    }

//    public override void Dispose()
//    {
//        _channel?.Close();
//        _connection?.Close();
//        base.Dispose();
//    }
//}
