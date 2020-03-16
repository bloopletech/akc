class Shell
  class << self
    def exec(command)
      puts "===> Running #{command}"

      output = ""  
      IO.popen(command) do |f|
        f.each_line do |line|
          output << line
          puts line.chomp
        end
      end

      if $? == 0
        puts "===> Command succeeded"
      else
        puts "===> Command failed: #{command}"
        exit
      end

      output
    end

    def exec_without_capture(command)
      puts "===> Running #{command}"
      Kernel.exec(command)
    end

    def script_cmd(script)
      if RUBY_PLATFORM =~ /darwin/
        "./#{script}.sh"
      else
        "cmd.exe /C #{script}.bat"
      end
    end
  end
end