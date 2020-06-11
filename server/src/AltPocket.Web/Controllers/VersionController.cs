using System.Reflection;
using Microsoft.AspNetCore.Mvc;

namespace AltPocket.Web.Controllers
{
  [ApiController]
  [Route("api/{controller}")]
  public class VersionController : ControllerBase
  {
    [HttpGet]
    public string Get()
    {
      var versionInfo = Assembly
          .GetEntryAssembly()
          .GetCustomAttribute<AssemblyInformationalVersionAttribute>();

      return versionInfo.InformationalVersion;
    }
  }
}