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

  console.log(image_urls)

  for(var url in image_urls) {
    const data = await worker.recognize(url);
    ocr_text.apppend(data)

  }

  await worker.terminate();

  console.log(ocr_text)

  return ocr_text
}

changeColor.addEventListener("click", function() {
  doOCR()
});
  