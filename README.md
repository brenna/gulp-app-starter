#Gulp + Browserify app starter 

##CSS
* autoprefixer
* Sass (with source maps)
* minification

##JS
* Browserify (with source maps)
* uglfiy
* JSHint

##HTML
* dev/production asset paths

##Other
* error notifications for Sass, JSHint & Browserify
* clean
* watch
* BrowserSync

#usage
1. git clone this repo
2. rename the cloned directory with your project name
2. from project directory, run `npm install` to download dependencies
3. run `gulp` to:
    * create or update `dist` directory for development
    * start a local server on port :3000 in your default browser
4. run `gulp build` to switch over to production asset paths (i.e. minified files)

##notes 
Browserify source maps aren't working on the latest Firefox Developer Edition (36). Use Chrome for source map debugging.
