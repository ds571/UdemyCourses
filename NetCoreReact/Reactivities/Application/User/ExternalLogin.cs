using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Migrations.Operations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.User
{
    public class ExternalLogin
    {

        public class Query : IRequest<User> 
        {
            public string AccessToken { get; set; }
        }

        public class Handler : IRequestHandler<Query, User>
        {
            private readonly UserManager<AppUser> _userManager;
            private readonly IFacebookAccessor _facebookAccessor;
            private readonly IJwtGenerator _jwtGenerator;

            public Handler(UserManager<AppUser> userManager, IFacebookAccessor facebookAccessor, IJwtGenerator jwtGenerator)
            {
                _userManager = userManager;
                _facebookAccessor = facebookAccessor;
                _jwtGenerator = jwtGenerator;
            }

            public async Task<User> Handle(Query request, CancellationToken cancellationToken)
            {
                var userInfo = await _facebookAccessor.FacebookLogin(request.AccessToken);

                if (userInfo == null) throw new RestException(HttpStatusCode.BadRequest, new { User = "Problem validating token" });

                var user = await _userManager.FindByEmailAsync(userInfo.Email);

                if(user == null)
                {
                    user = new AppUser
                    {
                        DisplayName = userInfo.Name,
                        Id = userInfo.Id,
                        Email = userInfo.Email,
                        UserName = "fb_" + userInfo.Id
                    };

                    var photo = new Photo
                    {
                        Id = "fb_" + userInfo.Id,
                        Url = userInfo.Picture.Data.Url,
                        IsMain = true
                    };

                    user.Photos.Add(photo); // Create initial collection of photos when adding new user

                    var result = await _userManager.CreateAsync(user);

                    if (!result.Succeeded) throw new RestException(HttpStatusCode.BadRequest, new { User = "Problem creating user" });
                }

                return new User
                {
                    DisplayName = user.DisplayName,
                    token = _jwtGenerator.CreateToken(user),
                    Username = user.UserName,
                    Image = user.Photos.FirstOrDefault(x => x.IsMain)?.Url
                };
            }
        }
    }
}
