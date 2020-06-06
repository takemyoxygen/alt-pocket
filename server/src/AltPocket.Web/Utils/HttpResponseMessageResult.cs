using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;

namespace AltPocket.Web.Utils
{
    public class HttpResponseMessageResult : IActionResult
    {
        private readonly HttpResponseMessage responseMessage;

        private readonly ISet<string> headersBlackList;

        public HttpResponseMessageResult(HttpResponseMessage responseMessage, ISet<string> headersBlackList)
        {
            this.responseMessage = responseMessage;
            this.headersBlackList = headersBlackList;
        }

        public async Task ExecuteResultAsync(ActionContext context)
        {
            context.HttpContext.Response.StatusCode = (int)responseMessage.StatusCode;

            foreach (var header in responseMessage.Headers)
            {
                if (!this.headersBlackList.Contains(header.Key))
                context.HttpContext.Response.Headers.TryAdd(header.Key, new StringValues(header.Value.ToArray()));
            }

            using (var stream = await responseMessage.Content.ReadAsStreamAsync())
            {
                await stream.CopyToAsync(context.HttpContext.Response.Body);
                await context.HttpContext.Response.Body.FlushAsync();
            }
        }
    }
}
