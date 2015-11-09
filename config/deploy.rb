SSHKit.config.command_map[:rake] = "bundle exec rake"

# config valid only for Capistrano 3.1
lock '3.2.1'

set :application, 'grevent'
set :repo_url, 'git@github.com:eduardm/grevent.git'
set :stages, ["production"]
set :rails_env, "production"

# Default branch is :master
# ask :branch, proc { `git rev-parse --abbrev-ref HEAD`.chomp }.call

# Default deploy_to directory is /var/www/my_app
set :deploy_to, '/home/deployer/rails_apps/grevent'

# Default value for :scm is :git
set :branch, "default"
set :deploy_via, :remote_cache
set :scm, 'git'

# files we want symlinking to specific entries in shared.
# set :linked_files, %w{config/database.yml}

# dirs we want symlinking to shared
set :linked_dirs, %w{bin log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system}

# Default value for :format is :pretty
# set :format, :pretty

# Default value for :log_level is :debug
# set :log_level, :debug

# Default value for :pty is false
# set :pty, true



# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5
set :keep_releases, 5
set :rvm_type, :user
set :rvm_ruby_string, '2.2.1@grevent'

#set :bundle_path, nil
#set :bundle_binstubs, nil
#set :bundle_flags, '--system'

namespace :deploy do

  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      # Your restart mechanism here, for example:
      execute :touch, release_path.join('tmp/restart.txt')
    end
  end

  after :publishing, :restart


end


