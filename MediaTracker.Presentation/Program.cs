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
    .AddHttpClients()
    .AddIdentityServices()
    .AddJwtAuth(builder.Configuration)
    .AddApplicationServices()
    .AddValidation()
    .AddCustomCors();

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

app.UseCors("AllowFrontend");

app.MapControllers();

await app.RunAsync();