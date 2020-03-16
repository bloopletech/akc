FROM bloopletech/ruby-base@sha256:2438d436874e204e063f196fd85107e2a9f7924b31bc61ceb6d8b18bd1df853d

#gem ffi -> dependency of sassc and rbtrace
#gem msgpack -> dependency of bootsnap and rbtrace
#gem nio4r -> dependency of actioncable
#gem websocket-driver -> dependency of actioncable
RUN apk add --no-cache build-base tzdata postgresql-dev nodejs git && \
    gem install bcrypt:3.1.12 bootsnap:1.4.1 ffi:1.10.0 msgpack:1.2.7 nio4r:2.3.1 nokogiri:1.10.1 pg:1.1.4 puma:3.12.0 sassc:2.0.1 websocket-driver:0.7.0 rbtrace:0.4.11 && \
    apk del build-base

COPY Gemfile Gemfile.lock ./
RUN bundle install --without development test

COPY . .

ENTRYPOINT ["rails", "server", "-b", "0.0.0.0"]