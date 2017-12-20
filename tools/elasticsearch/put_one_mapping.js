let elasticsearch = require('elasticsearch'),
    config = require('config'),
    pimsConfig = config.get('config'),
    settings = pimsConfig.elasticSearch.settings,
    elastic_index = pimsConfig.elasticSearch.indexName;
client = new elasticsearch.Client({
    host: pimsConfig.elasticSearch.url,
    log: 'trace'
});

let args = process.argv.slice(2);
args.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
});

if(args.length < 2){
    console.log("Set First Arg type, Second - attribute");
    process.exit()
}
let type =args[0].toString(),
    attribute=args[1].toString(),
    body ={ properties: { }};
    body.properties[attribute] ={
        type: "string",
        analyzer: "pims_analyzer"
    } ;
let indexParams = {
    index: elastic_index,
};

let requestParams = {
    index: elastic_index,
    type: type,
    body
};


client.indices.exists(indexParams).then((r) => {
    if (r) {
        console.log("Index  Exists , Closing ...");
       client.indices.putMapping(requestParams, rr =>{
           console.log(`Mapping for type ${type} attribute ${attribute} is put`)
       })


    }
}, (e) => {
    console.log(error)
});