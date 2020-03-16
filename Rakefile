APPS = %w{akc akc-api}

########################################################################################################################

unless File.expand_path(File.dirname(__FILE__)) == File.expand_path(Dir.getwd)
  puts "All rake tasks MUST be run from the project root directory"
  exit
end

unless APPS.all? { |app| app =~ /^[\w-]+$/ }
  puts "App names must not contain any shell-sensitive characters (hyphen is allowed)"
  exit
end

require_relative "./rake_support/shell.rb"
require_relative "./rake_support/build.rb"
require_relative "./rake_support/kube.rb"

namespace :shipping do
  task :import_ruby_base_image do
    ruby_base_image_sha = Build.get_images["bloopletech/ruby-base"]

    APPS.each do |app|
      Build.update_image_sha("#{app}/Dockerfile", "ruby-base", ruby_base_image_sha)
      Build.update_image_sha("kube/#{app}.yaml", "ruby-base", ruby_base_image_sha)
    end
  end

  task build: [:import_ruby_base_image] do
    Shell.exec(Shell.script_cmd("build"))

    images = Build.get_images
    APPS.each { |app| Build.update_image_sha("kube/#{app}.yaml", "#{app}", images["bloopletech/#{app}"]) }
  end

  task :deploy do
    args = APPS.map { |app| "-f kube/#{app}.yaml" }.join(" ")
    Shell.exec("kubectl apply #{args}")
  end

  task :migrate do
    puts "===> Waiting for kubernetes pod to become available"
    sleep 20

    Kube.exec(Kube.pod_name("akc-api"), "rake db:migrate")
  end

  task ship: [:build, :deploy, :migrate]
end

task ship: "shipping:ship"

namespace :kube do
  task :top do
    exec("kubectl top pods")
  end

  task :top_nodes do
    exec("kubectl top nodes")
  end

  task :secrets do
    app = ARGV[1]
    if app.nil? || app == ""
      puts "You must pass in an app name"
      exit
    end

    exec(%Q{KUBE_EDITOR="'$WHOME/Source/kube-secret-editor/kube-secret-editor.py'" kubectl edit secret #{app}-secret-envs})
  end

  task :exec do
    app = ARGV[1]
    command = ARGV[2..-1].join(" ")

    if app.nil? || app == ""
      puts "You must pass in at least an app name"
      exit
    end

    Kube.exec(Kube.pod_name(app), command)
  end
end

task exec: "kube:exec"

task :start do
  `reset`
  exec("PORT=3000 foreman start")
end

task default: :start
