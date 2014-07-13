desc "build static pages"
task :build do
  p "## Compiling static pages"
  system "bundle exec middleman build"
end

desc "deploy to github pages"
task :deploy do
  p "## Deploying to Github Pages"
  cp_r ".nojekyll", "build/.nojekyll"
  cd "build" do
    system "git add ."
    system "git add -u"
    message = "Site updated at #{Time.now.utc}"
    p "## Commiting: #{message}"
    system "git commit -m \"#{message}\""
    p "## Pushing generated website"
    system "git push origin master"
    p "## Github Pages deploy complete"
  end
end

desc "build and deploy to github pages"
task :publish do
  # SSH_ASKPASS
  Rake::Task["build"].invoke
  Rake::Task["deploy"].invoke
end