async function getWorker() {
  try{
    let worker = new Tesseract.createWorker({
      "workerBlobURL": false,
      "workerPath": chrome.runtime.getURL("tesseract/worker.min.js"),
      "corePath": chrome.runtime.getURL("tesseract/tesseract-core.wasm.js"),
      //"langPath": chrome.runtime.getURL("tesseract/")
      "langPath":"https://raw.githubusercontent.com/naptha/tessdata/gh-pages/4.0.0_fast"
    });

    await worker.load();
    await worker.loadLanguage('kor');
    await worker.initialize('kor');
    await worker.setParameters({
      tessjs_create_hocr:'0',
      tessjs_create_tsv:'0',
    });

    return worker;
  } catch(err){
    console.error(err);
    return null;
  }
}

async function doOCR(image_urls) {
  const workerN = 8;
  const scheduler = new Tesseract.createScheduler(); 
  const workers = await Promise.all(Array(workerN).fill(0).map(() => (getWorker())));
  
  for(var i = 0; i < workerN; i++) { scheduler.addWorker(workers[i]); }

  cropped_urls = []
  image_urls.forEach((element) => {
    if (typeof(element) == typeof('string')) { cropped_urls.push(config.detected)}
    else if(element.length == 0) {cropped_urls.push(config.empty)}
    else { for (url of element.slice(-1)) { cropped_urls.push(url) }}
  })

  const results = await Promise.all(cropped_urls.map((url) => {
    if (url == config.detected || url == config.empty) { return { data: { text : url } } } 
    return scheduler.addJob('recognize', url) 
  }));
  
  await scheduler.terminate();

  return results
}
  