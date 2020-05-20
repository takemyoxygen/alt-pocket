(ns alt-pocket-svc.core
  (:gen-class)
  (:use ring.adapter.jetty))

(defn handler [request]
  {:status 200
   :headers {"Content-Type" "text/html"}
   :body (str (:request-method request) " to " (:uri request))})

(defn start []
  (run-jetty #'handler
    {:port  3000
    :join? false}))

(defn -main
  [& args]
  (println "Hello, World!"))

