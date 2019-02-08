FROM java

RUN mkdir -p /usr/src/app

RUN apt-get update
RUN apt-get install -y wget

WORKDIR /usr/src/app
RUN wget https://artifacts.elastic.co/downloads/logstash/logstash-6.5.4.tar.gz
RUN tar -xvf logstash-6.5.4.tar.gz

EXPOSE 5000
EXPOSE 9600

CMD /usr/src/app/logstash-6.5.4/bin/logstash -e 'input { tcp { port => 5000 codec => json } } output { elasticsearch { hosts => ["elasticsearch:9200"] index => "cpdaimler-events" } }'
