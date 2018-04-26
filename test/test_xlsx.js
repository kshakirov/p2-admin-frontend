if (typeof require !== 'undefined') XLSX = require('xlsx');

function test_read_xls(filename) {
    let workbook = XLSX.readFile(filename);
    return XLSX.utils.sheet_to_json(workbook.Sheets['Line Items']);
}

let rows = test_read_xls('cpo_test.xls');
rows.forEach(r => {
    console.log(r);
})
