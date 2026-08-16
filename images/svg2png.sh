#!/bin/bash

inkscape back1.svg -w 497 -o back1.png
inkscape back2.svg -w 497 -o back2.png

inkscape favicon.svg -w 192 -o icon-192.png
inkscape favicon.svg -w 512 -o icon-512.png


convert -background none -density 256 favicon.svg \
  -define icon:auto-resize=16,32,48,64,128,256 favicon.ico

