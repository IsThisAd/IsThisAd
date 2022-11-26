

function findKeywords(results) {
    console.log(results)

    const labels = results.map((item) => (
        item.data.text.includes("제공")
    ));

    console.log(labels)

    return labels
}


function applyResults(ocrResult) {

    findKeywords(ocrResult)
    var boolResult = []
    ocrResult.forEach(function(result) {
        result.forEach(function (string){

        })
    })
}