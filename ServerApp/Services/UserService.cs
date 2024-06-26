using ServerApp.Models;
using System.Text.RegularExpressions;

namespace ServerApp.Services
{
    public class UserService(NewsDbContext dbContext) : IUserService
    {
        public List<string> Roles => ["eleve", "professeur", "direction"];

        public void CreatUser(string email)
        {
            var emailPattern = $@"^(?<firstname>[a-zA-Z]+)\.(?<lastname>[a-zA-Z]+)@(?<profil>{string.Join("|", Roles)})\.[a-zA-Z]+";

            var match = Regex.Match(email, emailPattern, RegexOptions.IgnoreCase);

            if(!match.Success) { return ;}

            var user = new User
            {
                Id = default,
                Email = email.ToLower(),
                FirstName = match.Groups["firstname"].Value,
                LastName = match.Groups["lastname"].Value,
                Profil = match.Groups["profil"].Value
            };

            dbContext.Users.Add(user);
            dbContext.SaveChanges();
        }

        public User? GetUser(string email)
        {
            email = email.ToLower();
            return dbContext.Users.FirstOrDefault(u => u.Email == email);
        }
    }
}
