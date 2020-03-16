# See https://blog.eq8.eu/til/content-type-applicationjson-by-default-in-rails-5.html for background.
class OverrideCorsMiddleware
  def initialize(app)
    @app = app
  end

  def call(env)
    env["CONTENT_TYPE"] = 'application/json' if env["CONTENT_TYPE"] == 'text/plain'
    @app.call(env)
  end
end