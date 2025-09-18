#! /bin/bash


##################
# 1. REGULAR WAY #
##################

ssh aws << EOF
  rm -rf my-room/
  mkdir my-room
EOF

scp -r ./demos/www aws:~/my-room
