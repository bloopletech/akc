class Build
  class << self
    def get_images
      text = Shell.exec(Shell.script_cmd("images"))
      images = {}

      text.split("\n").each do |line|
        line =~ /^([\w\/-]+).*(sha256:.*)$/
        images[$1] = $2
      end

      images
    end

    def subst_in_file(path, regexp, replacement)
      puts "===> Substituting #{regexp.inspect} in #{path} with #{replacement}"
      text = File.read(path)
      text.gsub!(regexp, replacement)
      File.open(path, "w") { |f| f << text }
    end

    def update_image_sha(path, name, sha)
      subst_in_file(path, /bloopletech\/#{Regexp.escape name}@sha256:\h+/, "bloopletech/#{name}@#{sha}")
    end
  end
end