using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace AltPocket.Web
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddCors();
            services.AddHttpClient();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            
            app
                .UseDefaultFiles()
                .UseStaticFiles()
                .UseRouting()
                .UseCors(policy => {
                    policy.WithOrigins("*").WithMethods("*").WithHeaders("*");
                })
                .UseEndpoints(endpoints =>
                {
                    endpoints.MapControllers();
                    endpoints.MapPost("api/{*url}", async context => {
                        var logger = app.ApplicationServices.GetService<ILogger<Startup>>();
                        var consumerKey = app.ApplicationServices.GetService<IConfiguration>()["ALT_POCKET_CONSUMER_KEY"];
                        var httpClient = app.ApplicationServices.GetService<IHttpClientFactory>().CreateClient();
                        var requestPath = context.Request.RouteValues["url"].ToString();

                        var url = new UriBuilder("https://getpocket.com");
                        url.Path = requestPath;

                        var bodyJson = await context.Request.Body.AsJson();
                        bodyJson.Root["consumer_key"] = consumerKey;
                        
                        var request = new HttpRequestMessage(
                            new HttpMethod(context.Request.Method),
                            $"https://getpocket.com/{requestPath}");

                        request.Content = new StringContent(bodyJson.ToString());
                        request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                        var response = await httpClient.SendAsync(request);
                        logger.LogInformation("Response successful: {0}", response.IsSuccessStatusCode);

                        foreach (var header in response.Headers)
                        {
                            context.Response.Headers[header.Key] = new StringValues(header.Value.ToArray());
                        }

                        context.Response.StatusCode = (int)response.StatusCode;

                        context.Response.Body = await response.Content.ReadAsStreamAsync();
                    });
                });
        }
    }
}

public static class Extensions 
{
    public async static Task<JObject> AsJson(this Stream content) 
    {
        using (var streamReader = new StreamReader(content))
        using (var jsonTextReader = new JsonTextReader(streamReader)) 
        {
            return await JObject.LoadAsync(jsonTextReader);
        }
    }
}
