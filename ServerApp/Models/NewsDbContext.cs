using Microsoft.EntityFrameworkCore;

namespace ServerApp.Models
{
    public class NewsDbContext(DbContextOptions options) : DbContext(options)
    {
        public DbSet<User> Users { get; set; }
        public DbSet<News> News { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>();
            modelBuilder.Entity<News>();
        }
    }
}
