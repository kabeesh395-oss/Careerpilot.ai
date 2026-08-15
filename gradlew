#!/bin/sh
# Forward gradle command to android directory if called from root
DIR="$(cd "$(dirname "$0")" && pwd)"
if [ -f "$DIR/android/gradlew" ]; then
  cd "$DIR/android" && ./gradlew "$@"
else
  echo "Error: android/gradlew not found."
  exit 1
fi
