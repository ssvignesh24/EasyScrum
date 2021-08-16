namespace :deploy do
  desc "reload the database with seed data"
  task :seed => [:set_rails_env] do
    on primary fetch(:migration_role) do
      within release_path do
        with rails_env: fetch(:rails_env) do
          execute :rails, "db:seed"
        end
      end
    end
  end

  after 'deploy:migrate', 'deploy:seed'
end