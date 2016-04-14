# VisualStudio2015Angular2Seed
A seed Visual Studio 2015 project for easy to start Angular 2 development.

1. Creating the new ASP.Net Web project
-------------------------------------------------------------------------------
- prerequisites:
  - vNext (ASP.Net 5) must be installed

- start VS2015 - new ASP.Net project
  - select ASP.Net 5 Preview Templates/"Empty" Asp.net application. Do not check "Host in the cloud"

- open project.json. The dependency versions must match the installed versions
  - start cmd, point to the project folder
    - type in: dnvm list. 
    - ensure the active version matches the dependency versions on the project.json file, 
      - if not, upgrade: dnvm upgrade, or install the required version
      - set the desired version: dnvm use [installed version to use]
    - in case when VS does not restore dependencies automatically, use the dnu utility. 
      Restore the dependencies: dnu restore
      - note: "dnu restore" must be started from where the project.json besides. 
      - it looks for dependencies in the project.json file and donwloads them if necesarry.
      - in case when it tries to restore from a wrong seed (our TeamCity repo) specify also the seed 
        (eg: dnu restore -s https://www.nuget.org/api/v2/)
      
    sample projec.json:
    {
        "version": "1.0.0-*",
        "compilationOptions": {
            "emitEntryPoint": true
        },

        "dependencies": {
            "Microsoft.AspNet.IISPlatformHandler": "1.0.0-rc1-final",
            "Microsoft.AspNet.Server.Kestrel": "1.0.0-rc1-final",
            "Microsoft.AspNet.StaticFiles": "1.0.0-rc1-final"
        },

        "commands": {
            "web": "Microsoft.AspNet.Server.Kestrel"
        },

        "frameworks": {
            "dnx451": { },
            "dnxcore50": { }
        },

        "exclude": [
            "wwwroot",
            "node_modules"
        ],
        "publishExclude": [
            "**.user",
            "**.vspscc"
        ]
    }
    
  - to serve static files add Microsoft.AspNet.StaticFiles to project dependencies
  - delete the default middleware implementation (serving a "hello World" phrase) from startup.Configure, 
    and configure the application builder to serve static files instead:
    - add app.UseDefaultFiles();
    - add app.UseStaticFiles();
  - add a statif file (index.html) to the project's wwwroot folder (new item -> html page)
  
  sample startup.cs:
    using Microsoft.AspNet.Builder;
    using Microsoft.AspNet.Hosting;
    using Microsoft.Extensions.DependencyInjection;

    namespace Client
    {
        public class Startup
        {
            // This method gets called by the runtime. Use this method to add services to the container.
            // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=398940
            public void ConfigureServices(IServiceCollection services)
            {
            }

            // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
            public void Configure(IApplicationBuilder app)
            {
                app.UseIISPlatformHandler();
                app.UseDefaultFiles();
                app.UseStaticFiles();
            }

            // Entry point for the application.
            public static void Main(string[] args) => WebApplication.Run<Startup>(args);
        }
    }
    
- add a title and a body to the index.html and run the app skceleton. At this point the application is "runnable"    
  sample index.html:
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8" />
            <title>Sample ASP.Net wab app</title>
        </head>
        <body>
            Hello World!
        </body>
    </html>  

2. Adding angular to the ASP.Net Web project
-------------------------------------------------------------------------------
- Visula Studio comes with a npm (Node Package Manager) version v 1.4.x. 
  Angular2 requires v >= 2.x, so it is recommended to install Node.js, which in turn
  installs a new version of npm in the system.

- install and set-up node.js (https://nodejs.org)
  - after node.js is isntalled, it is recommended to install npm cli globally: npm -g install npm
    - this will place also the newly installed npm on the top of the search path, so VS will use that version instead.
      note: VS and/or any cmd shell windows must be restarted to reload the updated search path.

  - in case when you are behind a corporate proxy set up npm: 
    - npm config set proxy http://proxy.sdc.hp.com:8080
    - npm config set https-proxy http://proxy.sdc.hp.com:8080    
      
- add an npm configuration file to the web project (add a package.json file) and set up the required dependencies
  a configured package.json containing all the commonly used dependencies looks like this:
    {
        "version": "1.0.0",
        "name": "ASP.NET",
        "private": true,
        "dependencies": {
            "angular2": "^2.0.0-beta.14",
            "systemjs": "^0.19.26",
            "es6-shim": "^0.35.0",
            "es6-promise": "^3.1.2",
            "reflect-metadata": "0.1.2",
            "rxjs": "5.0.0-beta.2",
            "zone.js": "^0.6.10"
        },
        "devDependencies": {
        }
    }
  further frequently used dependencies should be bootstrap/foundation, jquery etc.
  
  - saving the package.json, npm attempts to resotre all the configured dependencies. Monitor the output window for details
  - in case of dependency version incompatibilities resolve them (the npm output should contain all the necesarry details 
    to resolve version incompatibilities)
  
2.1 Configure the typescript compiler
- by convention the script files (typescript files) of an Angular2 application are placed in a "scripts" folder.
  - create the "scripts" folder under the ASP.Net Web application project.
  - add a typescript configuration file to it (tsconfig.json) and configure it conform to the application's requirements.
    see: https://github.com/Microsoft/TypeScript-Handbook/blob/master/pages/Compiler%20Options.md for details
  
2.2 Configure Gulp to binplace node packages to wwwroot (Gulp is a task automation tool supported by VS. See: http://gulpjs.com/)
- gulp and its dependencies can be installed in the project by enumerating them in the devDependencies configuration section of npm (package.json)
- add gulp-related devDependenvies to package.json
    "devDependencies": {
        "gulp": "^3.9.1",
        "merge-stream": "^1.0.0",
        "rimraf": "^2.5.2",
        "gulp-typescript": "^2.13.0",
        "gulp-sourcemaps": "^1.6.0",
        "gulp-watch": "^4.3.5"
    }

- add a gulp configuration file (gulpfile.js) to the project.
  - create a task to bin-place all the dependent modules to wwwroot/lib.
  - create a task to bin-place all the referred stylesheets to wwwroot/lib/css.
  - create a task to bin-place all the application scripts to wwwroot/app.
  - create a task to clean all the the dependent modules from wwwroot/lib.
  - create a task to bin-place (watch) any modified application script to wwwroot/app.
  - bind the created tasks to the apropiate VS event ("before build", "clean", etc.).

3. Add Angular2 code using typescript to the application.  
- create the main app component (app.component.ts)
- create the application's bootstrap module (boot.ts)
- wire-up the Angular2 related modules into index.html (drag and drop the modules from the wwwroot/lib folder to the index.html's head section.
  note: the order of the modules is important (a module sould relay on the other)!
  - configure SystemJS (it is recommended to add defaultJSExtensions to true, so we don't need to specify .js each time referring a .js file)
  - import the application's bootstrap module (in our case boot.ts).
  - modify the body of the index.html to invoke tha main app component.
