using Microsoft.AspNetCore.Mvc;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace ApiVentas.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WhatsAppApiController : ControllerBase
    {
        [HttpPost]
        public IActionResult SendMessage(string toNumber, string message)
        {
            try
            {
                //string accountSid = "AC4e631fc3fd6cb56d3f937dd2a3bbe43b";//Environment.GetEnvironmentVariable("AC4e631fc3fd6cb56d3f937dd2a3bbe43b");
                //string authToken = "7536a6ea3da476b1f61eb5ffa5218e0c"; //Environment.GetEnvironmentVariable("7536a6ea3da476b1f61eb5ffa5218e0c");

                //TwilioClient.Init(accountSid, authToken);

                //var result = MessageResource.Create(
                //    body: message ?? "Hello there!",
                //    from: new Twilio.Types.PhoneNumber("whatsapp:+16203839676"),
                //    to: new Twilio.Types.PhoneNumber($"whatsapp:{toNumber}")
                //);

                //Console.WriteLine(result.Sid); 

                var accountSid = "AC4e631fc3fd6cb56d3f937dd2a3bbe43b";
                var authToken = "7536a6ea3da476b1f61eb5ffa5218e0c";
                TwilioClient.Init(accountSid, authToken);

                var messageOptions = new CreateMessageOptions(
                  new PhoneNumber("whatsapp:+593960588365"));
                messageOptions.From = new PhoneNumber("whatsapp:+14155238886");
                messageOptions.Body = "Your appointment is coming up on July 21 at 3PM";
                

                var messageR = MessageResource.Create(messageOptions);
                
                Console.WriteLine(messageR.Body); 
                return Ok(messageR);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
