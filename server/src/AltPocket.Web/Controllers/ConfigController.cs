using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

public class Config 
{
    public string ConsumerKey { get; set; }
}

[ApiController]
[Route("api/[controller]")]
public class ConfigController : ControllerBase
{
    private readonly IConfiguration configuration;
    public ConfigController(IConfiguration configuration)
    {
        this.configuration = configuration;
    }

    [HttpGet]
    public Config Get() 
    {
        return new Config() {ConsumerKey = this.configuration["ALT_POCKET_CONSUMER_KEY"]};
    }

}