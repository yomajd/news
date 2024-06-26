using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using ServerApp.Helper;
using ServerApp.Models;
using ServerApp.Services;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", builder => 
        builder.WithOrigins("http://localhost:4200")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials()
        );
});


builder.Services.AddControllers().AddJsonOptions(opts => {
    opts.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
});

builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 10485760; // 10 MB
});

builder.Services.AddSwaggerGen();

var bytes = Encoding.UTF8.GetBytes(builder.Configuration["Athentification:JwtSecret"]!);

builder.Services.AddHttpClient("SupabaseClient", client =>
{
    client.BaseAddress = new Uri(builder.Configuration["Athentification:ValidIssuer"]!);
    client.DefaultRequestHeaders.Add("apikey", builder.Configuration["Athentification:PublicKey"]);
});


builder.Services.AddAuthentication().AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(bytes),
        ValidAudience = builder.Configuration["Athentification:ValidAudience"],
        ValidIssuer = builder.Configuration["Athentification:ValidIssuer"]
    };
});

builder.Services.AddAuthorization();

var mongoDBSettings = builder.Configuration.GetSection("MongoDBSettings").Get<MongoDbSettings>();
builder.Services.Configure<MongoDbSettings>(builder.Configuration.GetSection("MongoDBSettings"));
builder.Services.AddDbContext<NewsDbContext>(options =>
{
    options.UseMongoDB(mongoDBSettings?.AtlasUri ?? "", mongoDBSettings?.DatabaseName ?? "");
});

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<INewsService, NewsService>();

var app = builder.Build();

app.UseCors("AllowSpecificOrigin");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.UseStaticFiles();

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(app.Environment.ContentRootPath, "Uploads")),
    RequestPath = "/Uploads"
});

app.Run();
