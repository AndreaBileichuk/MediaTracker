using MediaTracker.Presentation.Extensions;
using MediaTracker.Presentation.Filters;
using MediaTracker.Presentation.Middlewares;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services
    .AddControllers(options =>
    {
        options.Filters.Add<ValidationAndResultFilter>();
    });

builder.Services
    .AddLowercaseRouting()
    .AddSwagger()
    .AddDatabase(builder.Configuration)
    .AddConfigOptions(builder.Configuration)
    .AddIdentityServices()
    .AddJwtAuth(builder.Configuration)
    .AddApplicationServices()
    .AddValidation();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

await app.RunAsync();