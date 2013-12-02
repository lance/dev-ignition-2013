;; This is a simple verticle that can be run on its own.
;; If you started the demo app from the app directory.
;;
;;     $ vertx run start.js -cluster -conf config.json
;;
;; Then start up this verticle in clustered mode as well.
;;
;;     $ vertx run src/clj/chaos.clj -cluster -conf config.json
;;
;; It will join the cluster and start submitting random
;; vote updates for the candidates.
(ns demo.chaos
  (:require [vertx.core :as vertx]
            [vertx.eventbus :as eb]))
 
(defn update-vote [{:keys [votes _id]}]
  (eb/publish (str "/candidates/" _id)
    {:votes (+ votes
              (rand-int 5))}))
 
(vertx/periodic 1000
  (eb/send "/candidates" "all"
           (fn [{:keys [results]}] 
             (doseq [item results]
               (update-vote item)))))
