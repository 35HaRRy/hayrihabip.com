﻿using System;

using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

using NLog.Web;

namespace API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var build = BuildWebHost(args).Build();

            var logger = NLogBuilder
                .ConfigureNLog("nlog.config")
                .GetCurrentClassLogger();
            try
            {
                logger.Debug("init main");

                build.Run();
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Stopped program because of exception");
            }
            finally
            {
                NLog.LogManager.Shutdown();
            }

            build.Run();
        }

        public static IHostBuilder BuildWebHost(string[] args) =>
            Host
                .CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults
                (
                    webBuilder =>
                    {
                        webBuilder
                            .UseStartup<Startup>()
                            .ConfigureAppConfiguration
                            (
                                config =>
                                {
                                    var environmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
                                    config
                                        .SetBasePath(Environment.CurrentDirectory)
                                        .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                                        .AddJsonFile($"appsettings.{environmentName}.json", optional: true);
                                }
                            )
                            .ConfigureLogging
                            (
                                logging =>
                                {
                                    logging.ClearProviders();
                                    logging.SetMinimumLevel(LogLevel.Trace);
                                }
                            )
                            .UseNLog();
                    }
                );
    }
}
