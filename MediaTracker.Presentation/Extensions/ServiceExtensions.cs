using System.Text;
using FluentValidation;
using FluentValidation.AspNetCore;
using MediaTracker.BLL.DTOs.Validator;
using MediaTracker.BLL.Services.Account;
using MediaTracker.BLL.Services.Auth;
using MediaTracker.BLL.Services.Email;
using MediaTracker.BLL.Services.Media;
using MediaTracker.BLL.Services.MediaProvider;
using MediaTracker.BLL.Services.MediaProvider.Helpers;
using MediaTracker.BLL.Services.Note;
using MediaTracker.BLL.Services.PhotoService;
using MediaTracker.BLL.Settings;
using MediaTracker.DAL.Data;
using MediaTracker.DAL.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace MediaTracker.Presentation.Extensions;

static class ServiceExtensions
{
    public static IServiceCollection AddLowercaseRouting(this IServiceCollection services)
    {
        services.AddRouting(options =>
        {
            options.LowercaseUrls = true;
            options.LowercaseQueryStrings = true;
        });

        return services;
    }

    public static IServiceCollection AddSwagger(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(options =>
        {
            options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Name = "Authorization",
                Type = SecuritySchemeType.ApiKey,
                Scheme = "Bearer",
                BearerFormat = "JWT",
                In = ParameterLocation.Header,
                Description = "Введи 'Bearer' [пробіл] і твій токен.\r\n\r\nПриклад: \"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI...\""
            });

            options.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    new string[] {}
                }
            });
        });

        return services;
    }

    public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        services.AddDbContext<ApplicationDbContext>(options =>
        {
            options.UseNpgsql(connectionString, b => { b.MigrationsAssembly("MediaTracker.DAL"); });
        });

        return services;
    }

    public static IServiceCollection AddConfigOptions(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<JwtOptions>(
            configuration.GetSection(JwtOptions.SectionName)
        );

        services.Configure<TmdbOptions>(
            configuration.GetSection(TmdbOptions.SectionName)
        );

        services.Configure<CloudinaryOptions>(
            configuration.GetSection(CloudinaryOptions.SectionName)
        );

        services.Configure<EmailSettingsOptions>(
            configuration.GetSection(EmailSettingsOptions.SectionName)
        );
        
        return services;
    }

    public static IServiceCollection AddHttpClients(this IServiceCollection service)
    {
        service.AddHttpClient("TmdbClient", (serviceProvider, client) =>
        {
            var options = serviceProvider.GetRequiredService<IOptions<TmdbOptions>>().Value;
            client.BaseAddress = new Uri(options.BaseUrl);
        });

        return service;
    }
    
    public static IServiceCollection AddIdentityServices(this IServiceCollection services)
    {
        services.AddIdentity<ApplicationUser, IdentityRole>(options =>
        {
            options.User.RequireUniqueEmail = true;
            options.SignIn.RequireConfirmedAccount = false;
        })
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();
        
        return services;
    }

    public static IServiceCollection AddJwtAuth(this IServiceCollection services, IConfiguration configuration)
    {
        var jwtSection = configuration.GetSection("JWT");
        services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSection["Issuer"],
                    ValidAudience = jwtSection["Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSection["Key"]!))
                };
            });

        
        return services;
    }

    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<TmdbMovieProviderService>();
        services.AddScoped<TmdbSeriesProviderService>();
        
        services.AddScoped<MediaProviderServiceFactory>();
        services.AddScoped<IAuthService, AuthService>();
        
        services.AddScoped<IMediaService, MediaServiceWithCaching>();
        services.AddScoped<MediaService>();
        
        services.AddScoped<IMediaProviderManager, MediaProviderManager>();
        services.AddScoped<IPhotoService, CloudinaryPhotoService>();
        services.AddScoped<IAccountService, AccountService>();
        services.AddScoped<INoteService, NoteService>();

        services.AddTransient<IEmailService, EmailService>();
        
        return services;
    }

    public static IServiceCollection AddValidation(this IServiceCollection services)
    {
        services.AddFluentValidationAutoValidation();
        services.AddValidatorsFromAssemblyContaining<RegisterRequestValidator>();
        
        return services;
    }

    public static IServiceCollection AddCustomCors(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend", policy =>
            {
                policy.WithOrigins(configuration["FrontEndUrl"]!)
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });

        return services;
    }

    public static IServiceCollection AddCaching(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddStackExchangeRedisCache(redisOptions =>
        {
            var conection = configuration.GetConnectionString("Redis");

            redisOptions.Configuration = conection;
        });

        return services;
    }
}