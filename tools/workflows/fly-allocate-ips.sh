#!/bin/bash

# --------------------------------
# Init
# --------------------------------

#
# Make arguments into variables (including support for `--help`)
#
while [ $# -gt 0 ]; do
    if [[ $1 == "--help" ]]; then
        usage
        exit 0
    elif [[ $1 == "--"* ]]; then
        v="${1/--/}"
        declare "$v"="$2"
        shift
    fi
    shift
done

#
# Check for required params
#
if [[ -z $app ]]; then
    usage
    die "Missing parameter --app"
# elif [[ -z $tag ]]; then
#     usage
#     die "Missing parameter --tag"
fi


# --------------------------------
# Functions
# --------------------------------

#
# Usage
#
programname=$0
function usage() {
    echo ""
    echo "❓ New apps on Fly.io default to shared v4 ips.  Upon launching a new app, we need to intentionally allocate a dedicated v4 ip."
    echo ""
    echo "👉 usage: $programname --app string"
    echo ""
    echo "  --app string   The name of the Fly.io app."
    # echo "                          (example: blaze-search-term-redirect-service)"
    # echo "  --tag string            tag of the image to deploy"
    # echo "                          (example: 804-a325d6a)"
    # echo "  --namespace string      namespace of the cluster"
    # echo "                          (example: eos)"
    # echo "  --env string            env to which to deploy the tag"
    # echo "                          (example: dev)"
    echo ""
    echo ""
}

#
# Print output before exiting with an error message.
#
function die() {
    printf "❌ Script failed: %s\n\n" "$1"
    exit 1
}

#
# Print output before exiting with an error message.
#
# @param  $1  string  The name of the Fly.io app
#
# @returns The grep exit code.
#
function hasDedicatedV4Ip() {
  # Checks for no existing v4 addresses, or existing but shared addresses.
  local grep_code=$(( $(flyctl ips list --app "$1" | grep -cP "^v4.*public(?! \(shared\)).*") ))

  # If grep code is 0, then a dedicated (non-shared) v4 ip was found
  if [ $grep_code = 0 ] ; then
    true
  else
    false
  fi
}


# --------------------------------
# Go!
# --------------------------------

#
# Allocate dedicated IPv4 addresses if none exist.
#
if ( hasDedicatedV4Ip $app = False ) ; then
  echo -e "\n⚙️ Allocating a new IPv4 address for \"$app\""
  flyctl ips allocate-v4 --app "$app" --yes
else
  echo -e "\n✅ \"$app\" app already has a dedicated IPv4 address:"
  flyctl ips list --app "$app" | grep -P "^v4"
fi
