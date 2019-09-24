using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<List<Activity>> { }

        public class Handler : IRequestHandler<Query, List<Activity>>
        {
            private readonly DataContext _context;
            // Receive http requests and send http responses
            private readonly ILogger<List> _logger;
            public Handler(DataContext context /*, ILogger<List> logger*/)
            {
                //_logger = logger;
                // Go out and get activities from database
                _context = context;
            }

            public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                /*
                try
                {
                    for (var i = 0; i < 10; i++)
                    {
                        cancellationToken.ThrowIfCancellationRequested();
                        // if it wasn't
                        await Task.Delay(1000, cancellationToken);
                        _logger.LogInformation($"Task {i} has completed");
                    }
                }
                catch(Exception ex) when (ex is TaskCanceledException)
                {
                    _logger.LogInformation("Task was cancelled");
                }
                */
                // Get list of our activities and return them
                var activities = await _context.Activities.ToListAsync();

                return activities;
            }
        }
    }
}