using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using AutoMapper;
using Api.Helpers;
using Api.Data;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;

namespace Api
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration _configuration)
        {
            Configuration = _configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<AppDbContext>(options => 
            {
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
            });

            services.AddAuthentication("Bearer")
                .AddJwtBearer("Bearer", options =>
                {
                    options.Authority = "http://localhost:5000";
                    options.Audience = "api";
                    options.RequireHttpsMetadata = false;
                });

            services.AddCors(options =>
                options.AddPolicy("AllowAll", p =>
                    p.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader())
                );

            services.AddScoped<IBugTrackerRepository, BugTrackerRepository>();

            services.AddAutoMapper(typeof(Startup));

            services.AddControllers();

            services.AddHttpClient();

        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCors("AllowAll");

            app.UseRouting();

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapDefaultControllerRoute();
            });
        }
    }
}
