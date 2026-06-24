// This worker simulates LaTeX compilation for now.
// In a real implementation, you would load tectonic or swiftlatex WASM modules here.

self.onmessage = async (e) => {
  const { texCode, images } = e.data;
  
  try {
    const response = await fetch('http://localhost:8000/api/v1/resume/compile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tex_code: texCode, images })
    });
    
    if (!response.ok) {
      throw new Error('Compilation failed. Please check LaTeX syntax.');
    }
    
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    
    self.postMessage({ success: true, pdfData: url });
  } catch (error) {
    self.postMessage({ success: false, error: error instanceof Error ? error.message : 'Compilation failed' });
  }
};
