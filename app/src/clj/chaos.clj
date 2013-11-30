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
            [vertx.eventbus :as eb]
            [vertx.logging :as log]))

(defn update-vote [record]
  (let [votes (+ (get record :votes)
                 (rand-int 5))
        addr (str "/candidates/" (get record :_id))] 
    (eb/publish addr {:votes votes})))

(defn fetch-and-update [_]
  (eb/send "/candidates" "all"
           (fn [response] 
             (doseq [item (seq (get response :results))] (update-vote item)))))

(vertx/periodic* 1000 fetch-and-update)


