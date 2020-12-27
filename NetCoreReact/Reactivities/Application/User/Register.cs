using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Persistence;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Application.Errors;
using System.Net;
using Application.Validators;
using Microsoft.AspNetCore.WebUtilities;

namespace Application.User
{
    public class Register
    {

        public class Command : IRequest
        {
            public string DisplayName { get; set; }
            public string Username { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
            public string Origin { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.DisplayName).NotEmpty();
                RuleFor(x => x.Username).NotEmpty();
                RuleFor(x => x.Email).NotEmpty().EmailAddress();
                RuleFor(x => x.Password).Password();
            }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly UserManager<AppUser> _userManager;
            // private readonly IJwtGenerator _jwtGenerator;
            private readonly IEmailSender _emailSender;

            public Handler(DataContext context, UserManager<AppUser> userManager, IEmailSender emailSender)
            {
                _context = context;
                _userManager = userManager;
                //_jwtGenerator = jwtGenerator;
                _emailSender = emailSender;
            }

            // Return a MediatR Unit
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                // handler logic
                if(await _context.Users.Where(x => x.Email == request.Email).AnyAsync())
                {
                    throw new RestException(HttpStatusCode.BadRequest, new { Email = "Email already exists" });
                }
                if (await _context.Users.Where(x => x.UserName == request.Username).AnyAsync())
                {
                    throw new RestException(HttpStatusCode.BadRequest, new { Username = "Username already exists" });
                }

                var user = new AppUser
                {
                    DisplayName = request.DisplayName,
                    Email = request.Email,
                    UserName = request.Username,
                    //RefreshToken = _jwtGenerator.GenerateRefreshToken(),
                    //RefreshTokenExpiry = DateTime.UtcNow.AddDays(30)
                };

                var result = await _userManager.CreateAsync(user, request.Password);

                if (!result.Succeeded)
                {
                    throw new Exception("Problem creating user");
                    // Commented out since we are implementing confirmation email
                    //return new User
                    //{
                    //    DisplayName = user.DisplayName,
                    //    token = _jwtGenerator.CreateToken(user),
                    //    RefreshToken = user.RefreshToken,
                    //    Username = user.UserName,
                    //    Image = user.Photos?.FirstOrDefault(x => x.IsMain)?.Url ?? ""
                    //};
                }

                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                // Need to convert to query string friendly format
                token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token)); // Pure string

                var verifyUrl = $"{request.Origin}/user/verifyEmail?token={token}&email={request.Email}";

                var message = $"<p>Please click the below link to verify your email address:</p>" +
                    $"<p><a href='{verifyUrl}'>{verifyUrl}</a></p>";

                await _emailSender.SendEmailAsync(request.Email, "Please verify email address", message);

                return Unit.Value;
            }
        }
    }
}
