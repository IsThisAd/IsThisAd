async function doOCR(images) {
  const image = document.getElementById('image');
    const { createWorker } = Tesseract;
    const worker = createWorker({
      workerPath: chrome.runtime.getURL('js/worker.min.js'),
      langPath: chrome.runtime.getURL('.'),
      corePath: chrome.runtime.getURL('js/tesseract-core.wasm.js'),
    });
    
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(image);
    console.log(text);
    result.innerHTML = `<p>OCR Result:</p><p>${text}</p>`;
    await worker.terminate();
  }
  
  const doTest = (text) =>{
    console.log(text);
  }

  //const startBtn = document.getElementById('changeColor');
  //startBtn.onclick = doOCR;
  /*
  changeColor.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    doOCR()
  });
  */
  