using BLL;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using NLog.Config;

namespace API
{
    /// <summary>
    ///     Uygulamanın başladığı yer
    /// </summary>
    public class Startup
    {
        /// <summary>
        ///     Initilizer
        /// </summary>
        /// <param name="configuration">
        ///     Bakınız <see cref="IConfiguration"/>
        /// </param>
        /// <param name="env">
        ///     Bakınız <see cref="IWebHostEnvironment"/>
        /// </param>
        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            Environment = env;
        }

        /// <summary>
        ///     Konfigürasyon
        /// </summary>
        public IConfiguration Configuration { get; }
        /// <summary>
        ///     Ortam değişkenleri
        /// </summary>
        public IWebHostEnvironment Environment { get; }

        /// <summary>
        ///     Servisleri uygulamaya dahil etmek için kullanılır.
        /// </summary>
        public void ConfigureServices(IServiceCollection services)
        {
            var applicationName = Configuration.GetValue<string>("YoutubeAPI:Application");
            var apiKey = Configuration.GetValue<string>("YoutubeAPI:Key");

            ConfigurationItemFactory.Default.Targets.RegisterDefinition(
                "ApplicationInsightsTarget", 
                typeof(Microsoft.ApplicationInsights.NLogTarget.ApplicationInsightsTarget)
            );

            services
                .AddSingleton<IBlogPostBLL, BlogPostBLL>()
                .AddSingleton<IYoutubeBLL, YoutubeBLL>(sp => new YoutubeBLL(Configuration, applicationName, apiKey))
                .AddControllers()
                .AddJsonOptions(option => option.JsonSerializerOptions.PropertyNamingPolicy = null);
        }

        /// <summary>
        ///     HTTP isteklerinde metot dizesini yönetmek için kullanılır.
        /// </summary>
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory logFactory)
        {
            if (env.IsProduction())
            {
                app
                .UseHttpsRedirection()
                .UseHsts();
            }
                
            app
                .UseStaticFiles() // For the wwwroot folder
                .UseRouting()
                .UseEndpoints(endpoints => endpoints.MapControllerRoute("default", "{controller=Home}/{action=Index}/{id?}"));
        }
    }
}
