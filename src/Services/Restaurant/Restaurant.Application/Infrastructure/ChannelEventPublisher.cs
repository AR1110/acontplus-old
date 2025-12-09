using System.Threading.Channels;

namespace Restaurant.Application.Infrastructure;

/// <summary>
/// Generic event publisher using System.Threading.Channels for decoupled asynchronous event processing
/// </summary>
/// <typeparam name="TEvent">The type of event to publish</typeparam>
public interface IEventPublisher<TEvent> where TEvent : class
{
    /// <summary>
    /// Publishes an event to the channel
    /// </summary>
    ValueTask PublishAsync(TEvent @event, CancellationToken cancellationToken = default);
}

public class ChannelEventPublisher<TEvent> : IEventPublisher<TEvent> where TEvent : class
{
    private readonly Channel<TEvent> _channel;

    public ChannelEventPublisher(int capacity = 100)
    {
        // Use bounded channel with drop oldest strategy to prevent memory issues
        var options = new BoundedChannelOptions(capacity)
        {
            FullMode = BoundedChannelFullMode.DropOldest
        };
        _channel = Channel.CreateBounded<TEvent>(options);
    }

    public ChannelReader<TEvent> Reader => _channel.Reader;

    public async ValueTask PublishAsync(TEvent @event, CancellationToken cancellationToken = default)
    {
        await _channel.Writer.WriteAsync(@event, cancellationToken);
    }
}
