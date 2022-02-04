#!/bin/bash

set -eoxu pipefail

shopt -s nullglob
for file in public/audio/*.wav; do
  ffmpeg -i $file ${file/.wav/.ogg}
  ffmpeg -i $file ${file/.wav/.mp3}
  rm $file
done
