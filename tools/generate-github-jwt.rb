#!/usr/bin/env ruby

require 'openssl'
require 'jwt'  # https://rubygems.org/gems/jwt
require 'optparse'

options = {}
OptionParser.new do |parser|
  parser.on("-p", "--pem-path PEMPATH",
            "Require the PEMPATH before executing your script") do |pem_path|
    options[:pem_path] = pem_path
  end
end.parse!

# Check required args
if options[:pem_path].nil?
  puts "\nError: pem_path is a required argument.\n\n"
  exit
end

# Private key contents
puts "\npem-path = #{options[:pem_path]}"
private_pem = File.read(options[:pem_path])
private_key = OpenSSL::PKey::RSA.new(private_pem)

# Generate the JWT
payload = {
  # issued at time, 60 seconds in the past to allow for clock drift
  iat: Time.now.to_i - 60,
  # JWT expiration time (10 minute maximum)
  exp: Time.now.to_i + (10 * 60),
  # GitHub App's identifier
  iss: "273553" # https://github.com/organizations/remix-austin/settings/apps/remixaustin-actions
}

puts "\nJWT:"
jwt = JWT.encode(payload, private_key, "RS256")
puts jwt
puts "\n"