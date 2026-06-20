// This worker simulates LaTeX compilation for now.
// In a real implementation, you would load tectonic or swiftlatex WASM modules here.

self.onmessage = async (e) => {
  const { texCode } = e.data;
  
  // Simulate compilation delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  console.log("Worker received code length:", texCode.length);

  try {
    // Return a dummy PDF blob url or base64. 
    // Usually WASM engines return a Uint8Array representing the PDF.
    
    // For now, we just pretend compilation succeeded.
    // We send a success message. We will use a real dummy PDF string in the UI for now.
    self.postMessage({ success: true, pdfData: null });
  } catch (error) {
    self.postMessage({ success: false, error: 'Compilation failed' });
  }
};
