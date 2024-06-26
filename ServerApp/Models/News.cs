using MongoDB.Bson;
using MongoDB.EntityFrameworkCore;

namespace ServerApp.Models
{
    [Collection("news")]
    public class News
    {
        public  ObjectId Id { get; set; }

        public required string Email { get; set; }

        public required string Title { get; set; }

        public required List<string> Profils { get; set; }

        public string? Description { get; set; }

        public string? Picture { get; set; }

        public List<string>? Pjs { get; set; }

        public DateTime PublicationDate { get; set; }

        public DateTime? ExpirationDate { get; set; }

        public List<string>? ReadMarker { get; set; }

    }
}
