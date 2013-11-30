#!/bin/sh
 
PROJECT=dev-ignition
ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

tmux new-session     -d -s ${PROJECT}
 
tmux rename-window      -t ${PROJECT}:0 "chaos"
tmux send-keys          -t ${PROJECT}:0 "cd ${ROOT}" C-m

tmux new-window         -t ${PROJECT}:1 -n "vim"
tmux split-window    -h -t ${PROJECT}:1
tmux select-pane        -t ${PROJECT}:1.0
tmux send-keys          -t ${PROJECT}:1 "cd ${ROOT}" C-m
tmux send-keys          -t ${PROJECT}:1 "vim" C-m
tmux -2 attach-session  -t ${PROJECT}


