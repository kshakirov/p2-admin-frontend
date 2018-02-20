curl -XDELETE '10.1.3.15:9200/pims-staging/individual/_query?pretty' -H 'Content-Type: application/json' -d'
{
  "query": {
    "match_all": {

    }
  }
}
'
