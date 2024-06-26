using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServerApp.Helper;
using ServerApp.Models;
using ServerApp.Models.ViewModel;
using ServerApp.Services;

namespace ServerApp.Controllers
{
    [Route("api/news")]
    [ApiController]
    [AllowAnonymous]
    public class NewsController(IWebHostEnvironment environment, INewsService newsService) : Controller
    {
        [HttpGet]
        [Authorize]
        public IEnumerable<NewsView> GetAllNews(int skip, int take)
        {
            var userRole = User.Claims.FirstOrDefault(c => c.Type.Contains("role"))?.Value;
            var userMail = User.Claims.FirstOrDefault(c => c.Type.Contains("emailaddress"))?.Value;
            if (string.IsNullOrEmpty(userRole))
            {
                return [];
            }

            var filter = new NewsFilter { Profil = userRole, Skip = skip, Take = take };
            return newsService.GetNews(filter).Select(n => Converter.GetNewsViewModel(n, userMail!));
        }

        [HttpGet("{id}")]
        [Authorize]
        public NewsView? GetNews(string id)
        {
            var userMail = User.Claims.FirstOrDefault(c => c.Type.Contains("emailaddress"))?.Value;
            var data = newsService.GetNewsById(id);
            return data != null ? Converter.GetNewsViewModel(data, userMail!) : null;
        }

        [HttpPost]
        [Authorize(Roles = "Direction")]
        public async Task<NewsView?> CreateNewsAsync([FromForm] NewsFormData formData)
        {
            if (!ModelState.IsValid)
            {
                return null;
            }
            
            var uploadFolderPath = Path.Combine(environment.ContentRootPath, "Uploads");
            var uploadsImgRoot = Path.Combine(environment.WebRootPath, "Images");
            var userMail = User.Claims.FirstOrDefault(c => c.Type.Contains("emailaddress"))?.Value;
            
            var news = new News
            {
                Title = formData.Title ?? string.Empty,
                Email = userMail ?? string.Empty,
                Description = formData.Description,
                ExpirationDate = formData.ExpirationDate,
                PublicationDate = DateTime.Now,
                Profils = formData.Profils ?? ["Eleve"]
            };

            newsService.AddNews(news);


            if (formData.Attachments != null)
            {
                var newsAttachmentsDirectory = Path.Combine(uploadFolderPath, news.Id.ToString());
                Directory.CreateDirectory(newsAttachmentsDirectory);
                news.Pjs = [];
                foreach (var file in formData.Attachments)
                {
                    var filePath = Path.Combine(newsAttachmentsDirectory, file.FileName);
                    await using var stream = new FileStream(filePath, FileMode.Create);
                    await file.CopyToAsync(stream);
                    news.Pjs.Add(file.FileName);
                }
            }

            if (formData.Picture != null)
            {
                var newsImgDirectory = Path.Combine(uploadsImgRoot, news.Id.ToString());
                Directory.CreateDirectory(newsImgDirectory);
                var filePath = Path.Combine(newsImgDirectory, formData.Picture.FileName);
                await using var stream = new FileStream(filePath, FileMode.Create);
                await formData.Picture.CopyToAsync(stream);
                news.Picture = formData.Picture.FileName;
            }

            if(formData.Attachments != null || formData.Picture != null)
            {
                newsService.UpdateNews(news);
            }

            return Converter.GetNewsViewModel(news, userMail!);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Direction")]
        public async Task<IActionResult> UpdateNews(string id, [FromForm] NewsFormData formData)
        {
            var userMail = User.Claims.FirstOrDefault(c => c.Type.Contains("emailaddress"))?.Value;
            var news = newsService.GetNewsById(id);

            if(news == null)
            {
                return NotFound("News item not found");
            }

            if(news.Email != userMail)
            {
                return StatusCode(StatusCodes.Status403Forbidden);
            }

            var uploadFolderPath = Path.Combine(environment.ContentRootPath, "Uploads");


            var newsDirectory = Path.Combine(uploadFolderPath, id);

            if (!Directory.Exists(newsDirectory))
            {
                Directory.CreateDirectory(newsDirectory);
            }

            news.Pjs ??= [];

            if (formData.Attachments != null)
            {
                foreach (var file in formData.Attachments)
                {
                    var filePath = Path.Combine(newsDirectory, file.FileName);
                    await using var stream = new FileStream(filePath, FileMode.Create);
                    await file.CopyToAsync(stream);
                    news.Pjs.Add(file.FileName);
                }
            }

            if (formData.Picture != null)
            {
                var filePath = Path.Combine(newsDirectory, formData.Picture.FileName);
                await using var stream = new FileStream(filePath, FileMode.Create);
                await formData.Picture.CopyToAsync(stream);
                news.Picture = formData.Picture.FileName;
            }

            if (!string.IsNullOrEmpty(formData.Title)) 
            {
                news.Title = formData.Title;
            }

            if (!string.IsNullOrEmpty(formData.Description))
            {
                news.Description = formData.Description;
            }

            if (formData.ExpirationDate != null)
            {
                news.ExpirationDate = formData.ExpirationDate;
            }

            if (formData.Profils is { Count: > 0 })
            {
                news.Profils = formData.Profils;
            }

            newsService.UpdateNews(news);

            return Ok(Converter.GetNewsViewModel(news, userMail!));

        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Direction")]
        public IActionResult DeleteNews(string id)
        {
            var news = newsService.GetNewsById(id);
            var userMail = User.Claims.FirstOrDefault(c => c.Type.Contains("emailaddress"))?.Value;

            if (news == null)
            {
                return NotFound();
            }

            if (news.Email != userMail)
            {
                return StatusCode(StatusCodes.Status403Forbidden);
            }

            var uploadFolderPath = Path.Combine(environment.ContentRootPath, "Uploads");
            var uploadsImgRoot = Path.Combine(environment.WebRootPath, "Images");

            var newsAttachmentsDirectory = Path.Combine(uploadFolderPath, id);
            var newsImgDirectory = Path.Combine(uploadsImgRoot, news.Id.ToString());

            if (Directory.Exists(newsAttachmentsDirectory))
            {
                Directory.Delete(newsAttachmentsDirectory, true);
            }

            if (Directory.Exists(newsImgDirectory))
            {
                Directory.Delete(newsImgDirectory, true);
            }

            try
            {
                newsService.DeleteNews(id);
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", ex.Message);
                return BadRequest(ModelState);
            }

            return Ok();
        }

        [HttpPut("markRead")]
        [Authorize]
        public IActionResult MarkAsRead([FromBody] NewsRead data)
        {
            var userMail = User.Claims.FirstOrDefault(c => c.Type.Contains("emailaddress"))?.Value;
            newsService.MarkNewsAsRead(userMail!, data.NewsId);
            return Ok();
        }
    }
}
