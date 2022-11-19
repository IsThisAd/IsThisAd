async function doOCR(image_urls) {
  const image = document.getElementById("image")


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

  const data = await worker.recognize(image);
  console.log(data)
  await worker.terminate();

  console.log(ocr_text)

  return ocr_text
}
 