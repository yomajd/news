using ServerApp.Helper;
using ServerApp.Models;

namespace ServerApp.Services
{
    public interface INewsService
    {
        IEnumerable<News> GetNews(NewsFilter filter);

        News? GetNewsById(string id);

        void AddNews(News news);

        void UpdateNews(News news);

        void DeleteNews(string id);

        void UpdateNewsPicture(string id, string filePath);

        void MarkNewsAsRead(string email, string newsId);
    }
}
