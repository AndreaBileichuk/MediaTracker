using MediaTracker.BLL.Infrastructure;
using Microsoft.Extensions.Configuration;

namespace MediaTracker.BLL.Services.Email;

public interface IEmailService
{
    Task SendEmailAsync(string toEmail, string subject, string body);
}