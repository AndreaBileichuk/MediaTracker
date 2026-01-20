using System.Net;
using System.Net.Mail;
using MediaTracker.BLL.Settings;
using Microsoft.Extensions.Options;

namespace MediaTracker.BLL.Services.Email;

public class EmailService : IEmailService
{
    private readonly EmailSettingsOptions _emailSettings;

    public EmailService(IOptions<EmailSettingsOptions> options)
    {
        _emailSettings = options.Value;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string body)
    {
        using var smtpClient = new SmtpClient(_emailSettings.Host, _emailSettings.Port);
        smtpClient.Credentials = new NetworkCredential(_emailSettings.User, _emailSettings.Password);
        smtpClient.EnableSsl = true;

        var mailMessage = new MailMessage()
        {
            From = new MailAddress(_emailSettings.User),
            Subject = subject,
            Body = body,
            IsBodyHtml = true
        };

        mailMessage.To.Add(toEmail);

        await smtpClient.SendMailAsync(mailMessage);
    }
}