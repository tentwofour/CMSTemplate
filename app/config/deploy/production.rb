# Set the proper parameters file
set :parameters_file, "parameters_production.yml"

set :domain,        ""

server              domain, :app, :web, :primary => true

set :user,          ""
set :deploy_to,     ""
set :deploy_via,    :remote_cache
set :branch,        "master"

role :web,          domain
role :app,          domain, :primary => true
role :db,           domain, :primary => true

# Webserver user and permissions, writeable dirs is set in main deploy.rb script
set :webserver_user,        "apache"
set :permission_method,     :acl
set :use_set_permissions,   true