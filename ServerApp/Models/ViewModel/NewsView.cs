namespace ServerApp.Models.ViewModel
{
    public class NewsView
    {
        public string? Id { get; set; }

        public string? CreatorEmail { get; set; }

        public required string Title { get; set; }

        public required List<string> Profils { get; set; }

        public string? Description { get; set; }

        public string? Picture { get; set; }

        public IEnumerable<string>? Pjs { get; set; }

        public DateTime PublicationDate { get; set; }

        public DateTime ExpirationDate { get; set; }

        public bool IsRead { get; set; }

    }
}
