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

    private readonly ISet<string> headersWhiteListToUnderlyingApi;

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

      this.headersWhiteListToUnderlyingApi = new HashSet<string>(StringComparer.InvariantCultureIgnoreCase) {
        "X-Accept"
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

      foreach (var header in this.Request.Headers.Where(h => this.headersWhiteListToUnderlyingApi.Contains(h.Key)))
      {
        requestMsg.Headers.TryAddWithoutValidation(header.Key, header.Value.AsEnumerable());
      }

      var requestHeadersString = string.Join(
          Environment.NewLine,
          requestMsg.Headers.Select(pair => $"{pair.Key}: {string.Join(",", pair.Value)}")
      );

      this.logger.LogInformation("Sending request to {0} with headers{1}{2}", url, Environment.NewLine, requestHeadersString);

      var response = await httpClient.SendAsync(requestMsg);

      this.logger.LogInformation("Received response with status code {0}", response.StatusCode);

      if (!response.IsSuccessStatusCode)
      {
        var responseHeadersString = string.Join(
          Environment.NewLine,
          response.Headers.Select(pair => $"{pair.Key}: {string.Join(",", pair.Value)}")
        );

        this.logger.LogWarning(
          "Request to {0} failed with status code {1}{2}. Headers:{3}{4}",
           url,
           response.StatusCode,
           response.ReasonPhrase,
           Environment.NewLine,
           responseHeadersString
        );
      }

      this.HttpContext.Response.RegisterForDispose(response);

      return new HttpResponseMessageResult(response, this.headersBlacklistToClient);
    }
  }
}

