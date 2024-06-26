using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ServerApp.Helper;
using ServerApp.Models.ViewModel;
using ServerApp.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace ServerApp.Controllers
{
    [Route("api/user")]
    [ApiController]
    [AllowAnonymous]
    public class UserController(IHttpClientFactory httpClientFactory, IUserService userService) : ControllerBase
    {
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginFormData request)
        {
            var httpClient = httpClientFactory.CreateClient("SupabaseClient");

            var userView = new LoginView();

            var content = new StringContent(JsonConvert.SerializeObject(new
            {
                email = request.Email,
                password = request.Password
            }), Encoding.UTF8, "application/json");

            var response = await httpClient.PostAsync("/auth/v1/token?grant_type=password", content);

            if (!response.IsSuccessStatusCode)
            {
                return BadRequest("Invalid login attempt.");
            }

            var jsonResponse = await response.Content.ReadAsStringAsync();
            var authResponse = JsonConvert.DeserializeObject<JwtToken>(jsonResponse);
            var jwtToken = authResponse?.access_token;

            userView.AuthToken = jwtToken;

            var handler = new JwtSecurityTokenHandler();
            var decodedJwt = handler.ReadJwtToken(jwtToken);

            var email = decodedJwt.Claims.FirstOrDefault(c => c.Type == "email")?.Value;

            if(string.IsNullOrEmpty(email))
            {
                return NotFound();
            }

            var user = userService.GetUser(email);

            if (user == null)
            {
                userService.CreatUser(email);

                user = userService.GetUser(email);

                if(user == null)
                {
                    return NotFound();
                }
            }
            userView.User = Converter.GetUserViewModel(user);
            return Ok(userView);
        }
    }

}
