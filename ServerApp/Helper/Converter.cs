using ServerApp.Models;
using ServerApp.Models.ViewModel;

namespace ServerApp.Helper;

public static class Converter
{
    public static NewsView GetNewsViewModel(News data, string userEmail)
    {
        return new NewsView
        {
            Id = data.Id.ToString(),
            CreatorEmail = data.Email,
            Profils = data.Profils,
            Title = data.Title,
            Description = data.Description,
            Picture = data.Picture,
            PublicationDate = data.PublicationDate,
            ExpirationDate = data.ExpirationDate ?? DateTime.Now,
            Pjs = data.Pjs,
            IsRead = data.ReadMarker?.Contains(userEmail) ?? false
        };
    }

    public static UserView GetUserViewModel(Models.User user)
    {
        return new UserView
        {
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Profil = user.Profil
        };
    }
}