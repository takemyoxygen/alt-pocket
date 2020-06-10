using System;
using System.Collections.Generic;
using System.Linq;
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

    private readonly ISet<string> headersBlacklistToUnerlyingApi;

    private readonly ISet<string> headersBlacklistToClient;

    public ProxyController(ILogger<ProxyController> logger, IConfiguration configuration, IHttpClientFactory httpClientFactory)
    {
      this.logger = logger;
      this.httpClientFactory = httpClientFactory;
      this.consumerKey = configuration["ALT_POCKET_CONSUMER_KEY"];

      if (string.IsNullOrEmpty(this.consumerKey))
      {
        throw new Exception("Missing required config value: ALT_POCKET_CONSUMER_KEY");
      }

      this.headersBlacklistToUnerlyingApi = new HashSet<string>(StringComparer.InvariantCultureIgnoreCase) {
        "User-Agent",
        "Origin",
        "Sec-Fetch-Site",
        "Sec-Fetch-Mode",
        "Sec-Fetch-Dest",
        "Referer"
      };

      this.headersBlacklistToClient = new HashSet<string>(StringComparer.InvariantCultureIgnoreCase) {
          "Transfer-Encoding"
      };
    }

    [HttpPost]
    [Route("{**url}")]
    public async Task<IActionResult> Proxy([FromBody] JObject request, string url)
    {
      var httpClient = this.httpClientFactory.CreateClient();

      request.Root["consumer_key"] = this.consumerKey;

      var requestMsg = new HttpRequestMessage(HttpMethod.Post, $"https://getpocket.com/{url}")
      {
        Content = new StringContent(request.ToString(), Encoding.UTF8, "application/json")
      };

      foreach (var header in this.Request.Headers.Where(h => !this.headersBlacklistToUnerlyingApi.Contains(h.Key)))
      {
        requestMsg.Headers.TryAddWithoutValidation(header.Key, header.Value.AsEnumerable());
      }

      if (this.logger.IsEnabled(LogLevel.Debug))
      {
        var headersString = string.Join(
            Environment.NewLine,
            requestMsg.Headers.Select(pair => $"{pair.Key}: {string.Join(",", pair.Value)}")
        );

        this.logger.LogDebug("Sending request to {0} with headers{1}{2}", url, Environment.NewLine, headersString);
      }
      else
      {
        this.logger.LogInformation("Sending request to {0}", url);
      }

      var response = await httpClient.SendAsync(requestMsg);

      this.logger.LogInformation("Received response with status code {0}", response.StatusCode);

      this.HttpContext.Response.RegisterForDispose(response);

      return new HttpResponseMessageResult(response, this.headersBlacklistToClient);
    }
  }
}

