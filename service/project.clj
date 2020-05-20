(defproject alt-pocket-svc "0.1.0-SNAPSHOT"
  :description "Alt Pocket Service"
  :url "http://example.com/FIXME"
  :license {:name "EPL-2.0 OR GPL-2.0-or-later WITH Classpath-exception-2.0"
            :url "https://www.eclipse.org/legal/epl-2.0/"}
  :dependencies [[org.clojure/clojure "1.10.1"]
                 [ring/ring-core "1.6.3"]
                 [ring/ring-jetty-adapter "1.6.3"]]
  :main ^:skip-aot alt-pocket-svc.core
  :target-path "target/%s"
  :profiles {:uberjar {:aot :all}})
