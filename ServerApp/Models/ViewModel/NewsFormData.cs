namespace ServerApp.Models.ViewModel
{
    public class NewsFormData
    {
        public string? Title { get; set; }

        public List<string>? Profils { get; set; }

        public string? Description { get; set; }

        public DateTime? ExpirationDate { get; set; }

        public IFormFile[]? Attachments { get; set; }


        public IFormFile? Picture { get; set; }
    }
}
