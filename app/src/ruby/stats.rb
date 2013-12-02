require "vertx"
include Vertx

def gather_records( reply_to )
  stats = {
    :candidates => {},
    :total => 0
  }

  EventBus.send( "/" + Vertx.config["mongo"]["collection"], 'all' ) do |response|
    response.body["results"].each do |record|
      update_counts( stats, record["name"], record["votes"].to_i )
    end
    calculate_percentages( stats )
    reply_to.reply( stats )
  end

end

def update_counts( stats, name, count ) 
  stats[:candidates][name] ||= {}
  stats[:candidates][name][:count] = count
  stats[:total] += count
end

def calculate_percentages( stats )
  stats[:candidates].each_pair do |name, record|
    record[:percent] = (stats[:total] == 0) ? 0 : (record[:count] / stats[:total].to_f)*100
  end
end

EventBus.register_handler('election.stats') do |message|
  gather_records( message )
end

