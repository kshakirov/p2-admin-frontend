curl -XPUT 'localhost:9200/pims-staging/_mapping/my_type?update_all_types' -H 'Content-Type: application/json' -d'
{
  "properties": {
    "user": {
      "type":     "text",
      "fielddata": true
    }
  }
}
'
