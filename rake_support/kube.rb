class Kube
  class << self
    def pod_names(app)
      lines = Shell.exec("kubectl get pods -l=app=#{app} --sort-by=.status.startTime -o name")
      lines.split("\n").map { |line| line.gsub(/^pod\//, "") }
    end

    def pod_name(app)
      pod_names(app).last
    end

    def exec(pod, command)
      command = "/bin/sh" if command.nil? || command == ""
      Shell.exec_without_capture("kubectl exec -it #{pod} #{command}")
    end
  end
end