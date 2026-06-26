// This worker simulates LaTeX compilation for now.
// In a real implementation, you would load tectonic or swiftlatex WASM modules here.

self.onmessage = async (e) => {
  const { texCode, images } = e.data;
  
  try {
    const response = await fetch(`${import.meta.env.VITE_AI_URL}/api/v1/resume/compile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tex_code: texCode, images })
    });
    
    if (!response.ok) {
      let errorMsg = 'Compilation failed. Please check LaTeX syntax.';
      try {
        const errorData = await response.json();
        if (errorData.detail) errorMsg = errorData.detail;
      } catch (e) {
        // Fallback to generic if not JSON
      }
      throw new Error(errorMsg);
    }
    
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    
    self.postMessage({ success: true, pdfData: url });
  } catch (error) {
    self.postMessage({ success: false, error: error instanceof Error ? error.message : 'Compilation failed' });
  }
};
