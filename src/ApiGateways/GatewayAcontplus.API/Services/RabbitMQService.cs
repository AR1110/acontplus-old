//using GatewayAcontplus.API.Entities;
//using Newtonsoft.Json;
//using RabbitMQ.Client;
//using System.Text;

//namespace GatewayAcontplus.API.Services;
//public interface IMessageQueueService
//{
//    void EnqueueRequest(ApiRequest request);
//}

//public class RabbitMQService : IMessageQueueService, IDisposable
//{
//    private readonly IModel _channel;
//    private readonly IConnection _connection;
//    private readonly string _queueName;

//    public RabbitMQService(IConfiguration configuration)
//    {
//        var factory = new ConnectionFactory()
//        {
//            HostName = configuration["RabbitMQ:HostName"],
//            UserName = configuration["RabbitMQ:UserName"],
//            Password = configuration["RabbitMQ:Password"]
//        };

//        _connection = factory.CreateConnection();
//        _channel = _connection.CreateModel();
//        _queueName = configuration["RabbitMQ:QueueName"];

//        _channel.QueueDeclare(queue: _queueName,
//                              durable: true,
//                              exclusive: false,
//                              autoDelete: false,
//                              arguments: null);
//    }

//    public void EnqueueRequest(ApiRequest request)
//    {
//        var json = JsonConvert.SerializeObject(request);
//        var body = Encoding.UTF8.GetBytes(json);

//        _channel.BasicPublish(exchange: "",
//                              routingKey: _queueName,
//                              basicProperties: null,
//                              body: body);
//    }

//    public void Dispose()
//    {
//        _channel?.Close();
//        _connection?.Close();
//    }
//}
