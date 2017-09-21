update elastic search max result window
curl -XPUT "http://10.1.3.15:9200/pims_staging/_settings" -d '{ "index" : { "max_result_window" : 5000000 } }'