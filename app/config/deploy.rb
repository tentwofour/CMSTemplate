###
# Configuration - look at deploy/staging.rb and deploy/production.rb as well
###

# Project name
set :application,           ""

# Repository
set :repository,            ""

# Keep 3 releases
set  :keep_releases,        3

###
# No touchy past here
###


set :stage_dir,             "app/config/deploy"

# Multistage setup
require                     'capistrano/ext/multistage'

# Set 2 stages
set :stages,                %w(staging production)

# Set default stage
set :default_stage,         "staging"

# shared across releases, symlinked from the shared folder to the current release folder
set :shared_files,          ["app/config/parameters.yml"]

# Share these across releases - not vendors, as we may want to update them across releases without breaking the current release
set :shared_children,       [log_path, app_path+"/Resources/node_modules", web_path+"/uploads", web_path+"/vendor" ]

# Use composer to manage vendors
set :use_composer,          true

# true will run composer update, we want to composer install to use the lockfile
set :update_vendors,        false
set :copy_vendors,          true

# SCM Settings
set :scm,                   :git
set :deploy_via,            :remote_cache

# Model Manager
set :model_manager,         "doctrine"

# Always dump assetic assets
set :dump_assetic_assets,   true

# Always update the assets version
set :update_assets_version, true

# Always install assets
set :assets_install,        true

# Writable directories, webserver user and other details in deploy/{env}.rb files
set :writable_dirs,         ["app/cache", "app/logs", "web/vendor/cache", "web/uploads"]

# No sudo
set :use_sudo,              false

# Set auto upload of parameters.yml file (shared, multistage setup)
set :parameters_dir, "app/config/parameters"
set :parameters_file, false

# Override no-script mode
set :composer_options, "--no-dev --verbose --prefer-dist --optimize-autoloader"

# Always ask for confirmations (for migrations, for instance) 
set :interactive_mode, true

#task to add 'parameters:' to an empty parameters file 
task :fix_empty_parameters_yml do 
    parameters_path = "app/config/parameters.yml" 
    run "
        LEN=$(cat #{shared_path}/#{parameters_path} | wc -c); 
        if [ $LEN -eq 0 ] ; then 
            echo \"parameters:\" > #{shared_path}/#{parameters_path} ; 
        fi
    "
end 

#run the parameters fix task before composer kicks off 
before "symfony:composer:install", "fix_empty_parameters_yml" 

# Upload parameters - first time deployment only
task :upload_parameters do
  origin_file = parameters_dir + "/" + parameters_file if parameters_dir && parameters_file
  
  puts "Origin File is: " + origin_file
  
  if origin_file && File.exists?(origin_file)
    ext = File.extname(parameters_file)
    relative_path = "app/config/parameters" + ext

    if shared_files && shared_files.include?(relative_path)
      destination_file = shared_path + "/" + relative_path
    else
      destination_file = latest_release + "/" + relative_path
    end
    try_sudo "mkdir -p #{File.dirname(destination_file)}"

    puts "Destination file is: " + destination_file
    
    top.upload(origin_file, destination_file)
  end
end

# Install node modules
namespace :composer do
   task :npm_install, :roles => :app do
        run "cd #{release_path}/app/Resources && npm install"
    end
end

# Create new symlink to shared node_modules folder
namespace :deploy do
    desc "Refresh shared node_modules symlink to current node_modules"
    task :refresh_node_modules_symlink do
        modules_dir = #{current_path}/node_modules
        
        if modules_dir && File.exists?(modules_dir)
          run "rm -rf #{current_path}/node_modules && ln -s #{shared_path}/node_modules #{release_path}/node_modules"
        end
    end
end

# Upload parameters file after deploy:setup is called
after "deploy:setup", "upload_parameters"

# Install node modules before composer update, as spbowerbundle relies on bower being installed
# and is run as a composer install/update script 
before 'symfony:composer:install', 'composer:npm_install', 'deploy:refresh_node_modules_symlink'

# Admin area requires assetic:dump
#after 'deploy:restart', 'symfony:assetic:dump'

# Ensure proper permissions, and update the assets version 
before "deploy:restart", "deploy:set_permissions"

# Be more verbose by uncommenting the following line
logger.level = Logger::MAX_LEVEL