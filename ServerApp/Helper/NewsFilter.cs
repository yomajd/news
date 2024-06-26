namespace ServerApp.Helper;

public class NewsFilter
{
    public int Take { get; set; }
    public int Skip { get; set; }
    public required string Profil { get; set; }
    public DateTime ExpirationDate { get; } = DateTime.Now.Date;
}