#!/bin/sh
# -----------------------------------------------------------------
# A simple bash script which sets up a tmux session and
# creates a couple of windows for use during the demo.
# -----------------------------------------------------------------
 
PROJECT=dev-ignition
ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
MONGO="/opt/mongo/current/bin/mongod"
MONGO_CFG="/etc/mongodb.conf"

tmux new-session     -d -s ${PROJECT}
 
tmux rename-window      -t ${PROJECT}:0 "chaos"
tmux send-keys          -t ${PROJECT}:0 "cd ${ROOT}/app" C-m

tmux new-window         -t ${PROJECT}:1 -n "vim"
tmux split-window    -h -t ${PROJECT}:1
tmux send-keys          -t ${PROJECT}:1.0 "cd ${ROOT}/app" C-m
tmux send-keys          -t ${PROJECT}:1.1 "cd ${ROOT}/app" C-m
tmux send-keys          -t ${PROJECT}:1.0 "vim" C-m
tmux select-pane        -t ${PROJECT}:1.0

tmux new-window         -t ${PROJECT}:2 -n "preso"
tmux send-keys          -t ${PROJECT}:2 "cd ${ROOT}/presentation" C-m
tmux send-keys          -t ${PROJECT}:2 "${MONGO} -config ${MONGO_CFG}" C-m
tmux send-keys          -t ${PROJECT}:2 "vertx run start.js" C-m

tmux select-window      -t ${PROJECT}:1
tmux -2 attach-session  -t ${PROJECT}


