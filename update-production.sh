#! /bin/bash


##################
# 1. REGULAR WAY #
##################

ssh aws << EOF
  rm -rf 3dgs-playcanvas/
  mkdir 3dgs-playcanvas
EOF

scp -r ./demos/www aws:~/3dgs-playcanvas
