update elastic search max result window
1. elastic search pagination - curl -XPUT "http://10.1.3.15:9200/pims_staging/_settings" -d '{ "index" : { "max_result_window" : 5000000 } }'
2. SSE NGINX to make it work set proxy-buffering - off