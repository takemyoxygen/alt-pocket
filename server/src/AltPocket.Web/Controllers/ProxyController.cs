using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using AltPocket.Web.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;

namespace AltPocket.Web.Controllers
{
    [ApiController]
    [Route("api")]
    public class ProxyController : ControllerBase
    {
        private readonly ILogger logger;

        private readonly IHttpClientFactory httpClientFactory;

        private readonly string consumerKey;

        public ProxyController(ILogger<ProxyController> logger, IConfiguration configuration, IHttpClientFactory httpClientFactory)
        {
            this.logger = logger;
            this.httpClientFactory = httpClientFactory;
            this.consumerKey = configuration["ALT_POCKET_CONSUMER_KEY"];

            if (string.IsNullOrEmpty(this.consumerKey))
            {
                throw new Exception("Missing required config value: ALT_POCKET_CONSUMER_KEY");
            }
        }

        [HttpPost]
        [Route("{**url}")]
        public async Task<IActionResult> Proxy([FromBody] JObject request, string url)
        {
            var httpClient = this.httpClientFactory.CreateClient();

            request.Root["consumer_key"] = this.consumerKey;

            this.logger.LogInformation("Sending request to {0}", url);

            var response = await httpClient.PostAsync(
                $"https://getpocket.com/{url}", 
                new StringContent(request.ToString(), Encoding.UTF8, "application/json"));

            this.HttpContext.Response.RegisterForDispose(response);

            return new HttpResponseMessageResult(response);
        }
    }
}

