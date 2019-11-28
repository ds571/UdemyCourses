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

namespace Application.User
{
    public class Register
    {

        public class Command : IRequest<User>
        {
            public string DisplayName { get; set; }
            public string Username { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
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

        public class Handler : IRequestHandler<Command, User>
        {
            private readonly DataContext _context;
            private readonly UserManager<AppUser> _userManager;
            private readonly IJwtGenerator _jwtGenerator;

            public Handler(DataContext context, UserManager<AppUser> userManager, IJwtGenerator jwtGenerator)
            {
                _context = context;
                _userManager = userManager;
                _jwtGenerator = jwtGenerator;
            }

            // Return a MediatR Unit
            public async Task<User> Handle(Command request, CancellationToken cancellationToken)
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
                    UserName = request.Username
                };

                var result = await _userManager.CreateAsync(user, request.Password);

                if (result.Succeeded)
                {
                    return new User
                    {
                        DisplayName = user.DisplayName,
                        token = _jwtGenerator.CreateToken(user),
                        Username = user.UserName,
                        Image = user.Photos?.FirstOrDefault(x => x.IsMain)?.Url ?? ""
                    };
                }

                throw new Exception("Problem creating user");
            }
        }
    }
}
