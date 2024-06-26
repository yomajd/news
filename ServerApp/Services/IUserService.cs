using ServerApp.Models;

namespace ServerApp.Services
{
    public interface IUserService
    {
        User? GetUser(string email);

        void CreatUser(string email);

    }
}
