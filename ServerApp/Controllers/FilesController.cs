using Microsoft.AspNetCore.Mvc;
using ServerApp.Services;

namespace ServerApp.Controllers
{
    [Route("api/files")]
    [ApiController]
    public class FilesController(INewsService newsServies, IWebHostEnvironment environment) : Controller
    {
        
        [HttpGet]
        public IActionResult GetFile(string id, string fileName)
        {
            var uploadsRoot = Path.Combine(environment.ContentRootPath, "Uploads", id);
            var filePath = Path.Combine(uploadsRoot, fileName);

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound();
            }

            var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            return File(fileStream, "application/octet-stream", fileName);
        }

      
        [HttpGet("{id}")]
        public IActionResult GetFiles(string id)
        {
            var uploadsRoot = Path.Combine(environment.ContentRootPath, "Uploads", id);

            if (!Directory.Exists(uploadsRoot))
            {
                return Ok();
            }
            var files = Directory.GetFiles(uploadsRoot).Select(Path.GetFileName).ToList();

            return Ok(files);
        }


        [HttpPost("{id}")]
        public IActionResult UploadPicture(string id, [FromForm] IFormFile? picture)
        {
            if (picture == null || picture.Length == 0)
            {
                return BadRequest(new { error = "No file uploaded." });
            }

            var uploadsRoot = Path.Combine(environment.WebRootPath, "Images", id);
            Directory.CreateDirectory(uploadsRoot);

            var existingFiles = Directory.GetFiles(uploadsRoot);
            foreach (var existingFile in existingFiles)
            {
                System.IO.File.Delete(existingFile);
            }

            var filePath = Path.Combine(uploadsRoot, picture.FileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                 picture.CopyTo(stream);
            }

            newsServies.UpdateNewsPicture(id, picture.FileName);

            // Return the new picture's relative path
            return Ok(new { url = Path.Combine("Images", id, picture.FileName) }); ;
        }

        [HttpDelete("{id}/{fileName}")]
        public IActionResult DeleteAttachment([FromRoute] string id, string fileName)
        {
            var filePath = Path.Combine(environment.ContentRootPath, "Uploads", id, fileName);
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }
            return Ok();
        }
    }
}
