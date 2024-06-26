using MongoDB.Bson;
using MongoDB.EntityFrameworkCore;

namespace ServerApp.Models
{
    [Collection("users")]
    public class User
    {
        public ObjectId Id { get; set; }

        public required string FirstName { get; set; }

        public required string LastName { get; set; }

        public required string Profil { get; set; }

        public required string Email { get; set; }

    }
}