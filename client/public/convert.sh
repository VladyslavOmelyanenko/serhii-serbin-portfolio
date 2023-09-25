#!/bin/bash

srcExt="webm"
destExt="mov"
srcDir="trailerswebm"
destDir="trailersmov"
opts="-c:v hevc_videotoolbox -allow_sw 1 -alpha_quality 0.75 -vtag hvc1 -movflags +faststart"

for filename in "$srcDir"/*.$srcExt; do
    basePath=${filename%.*}
    baseName=${basePath##*/}
    ffmpeg "-c:v" "libvpx-vp9" -i "$filename" $opts "$destDir"/"$baseName"."$destExt"
done

echo "Conversion from ${srcExt} to ${destExt} complete!"