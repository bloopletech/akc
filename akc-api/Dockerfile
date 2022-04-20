FROM ruby:2.6.6-alpine3.12

# throw errors if Gemfile has been modified since Gemfile.lock
RUN bundle config --global frozen 1

WORKDIR /usr/src/app
ENV LANG="C.UTF-8" SSL_CERT_DIR="/etc/ssl/certs" RAILS_ENV=production RAILS_LOG_TO_STDOUT=1 PORT=80

#gem ffi -> dependency of sassc
#gem msgpack -> dependency of bootsnap
#gem nio4r -> dependency of actioncable
#gem websocket-driver -> dependency of actioncable
RUN apk add --no-cache build-base tzdata postgresql-dev nodejs git && \
    gem install bcrypt:3.1.17 bootsnap:1.11.1 ffi:1.15.5 msgpack:1.5.1 nio4r:2.5.8 nokogiri:1.13.4 pg:1.3.5 puma:4.3.12 sassc:2.4.0 websocket-driver:0.7.5 && \
    apk del build-base

COPY Gemfile Gemfile.lock ./
RUN bundle install --without development test

COPY . .

ENTRYPOINT ["rails", "server", "-b", "0.0.0.0"]