using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;
using ServerApp.Helper;
using ServerApp.Models;

namespace ServerApp.Services;

public class NewsService(NewsDbContext dbContext) : INewsService
{
    public void AddNews(News news)
    {
        dbContext.News.Add(news);

        dbContext.ChangeTracker.DetectChanges();
        Console.WriteLine(dbContext.ChangeTracker?.DebugView.LongView);

        dbContext.SaveChanges();
    }

    public void DeleteNews(string id)
    {
        var news = dbContext.News.FirstOrDefault(n => n.Id == ObjectId.Parse(id));

        if (news != null)
        {
            dbContext.News.Remove(news);

            dbContext.ChangeTracker.DetectChanges();
            Console.WriteLine(dbContext.ChangeTracker?.DebugView.LongView);

            dbContext.SaveChanges();
        }
    }

    public IEnumerable<News> GetNews(NewsFilter filter)
    {
        return dbContext.News
            .Where(n => n.Profils.Contains(filter.Profil) && n.ExpirationDate > filter.ExpirationDate)
            .OrderByDescending(n => n.Id)
            .Skip(filter.Skip * filter.Take)
            .Take(filter.Take)
            .AsNoTracking()
            .AsEnumerable();
    }

    public News? GetNewsById(string id)
    {
        return dbContext.News.FirstOrDefault(n => n.Id == ObjectId.Parse(id));
    }

    public void UpdateNews(News news)
    {
        var newsToUpdate = dbContext.News.FirstOrDefault(n => n.Id == news.Id);

        if (newsToUpdate != null)
        {
            newsToUpdate.Title = news.Title;
            newsToUpdate.Picture = news.Picture;  // delete old pic
            newsToUpdate.Description = news.Description;
            newsToUpdate.ExpirationDate = news.ExpirationDate?.Date;
            newsToUpdate.Profils = news.Profils;

            dbContext.News.Update(newsToUpdate);

            dbContext.ChangeTracker.DetectChanges();
            Console.WriteLine(dbContext.ChangeTracker.DebugView.LongView);

            dbContext.SaveChanges();
        }
    }

    public void UpdateNewsPicture(string id, string newPicturePath)
    {
        var newsToUpdate = dbContext.News.FirstOrDefault(n => n.Id == ObjectId.Parse(id));
        if (newsToUpdate != null)
        {
            newsToUpdate.Picture = newPicturePath;
            dbContext.News.Update(newsToUpdate);
            dbContext.SaveChanges();
        }
    }

    public void MarkNewsAsRead(string email, string newsId)
    {
        var news = dbContext.News.FirstOrDefault(n => n.Id == ObjectId.Parse(newsId));

        if (news == null)
        {
            return;
        }
        
        news.ReadMarker ??= [];

        if (!news.ReadMarker.Contains(email))
        {
            news.ReadMarker.Add(email);
            dbContext.News.Update(news);
            dbContext.SaveChanges();
        }
    }
}