unless File.expand_path(File.dirname(__FILE__)) == File.expand_path(Dir.getwd)
  puts "All rake tasks MUST be run from the project root directory"
  exit
end

require_relative "./rake_support/shell.rb"
require_relative "./rake_support/build.rb"
require_relative "./rake_support/kube.rb"

namespace :shipping do
  task :import_ruby_base_image do
    ruby_base_image_sha = Build.get_images["bloopletech/ruby-base"]

    Build.update_image_sha("akc-api/Dockerfile", "ruby-base", ruby_base_image_sha)
    Build.update_image_sha("kube/akc-api.yaml", "ruby-base", ruby_base_image_sha)
  end

  task build: [:import_ruby_base_image] do
    Shell.exec(Shell.script_cmd("build"))

    images = Build.get_images
    Build.update_image_sha("kube/akc-api.yaml", "akc-api", images["bloopletech/akc-api"])
  end

  task :deploy do
    Shell.exec("kubectl apply -f kube/akc-api.yaml")
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
