async function doOCR(image_urls) {

  const worker = new Tesseract.createWorker({
    "workerBlobURL": false,
    "workerPath": chrome.runtime.getURL("tesseract/worker.min.js"),
    "corePath": chrome.runtime.getURL("tesseract/tesseract-core.wasm.js"),
    "langPath": "https://raw.githubusercontent.com/naptha/tessdata/gh-pages/4.0.0_fast"
  });

  await worker.load();
  await worker.loadLanguage('kor');
  await worker.initialize('kor');

  ocr_text = []

  for(var url in image_urls) {
    const data = await worker.recognize(url);
    orc_text.apppend(data)
  }

  await worker.terminate();

  console.log(orc_text)

  return ocr_text
}

changeColor.addEventListener("click", function() {
  doOCR()
});
  