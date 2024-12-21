const { ipcRenderer } = require("electron");

const dropZone = document.getElementById("drop-zone")!;
const fileInput = document.getElementById("file-input") as HTMLInputElement;
const spinner = document.getElementById("spinner")!;
const result = document.getElementById("result")!;

// Handle file selection
dropZone?.addEventListener("click", () => {
  fileInput?.click();
});

fileInput?.addEventListener("change", (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    handleFile(file);
  }
});

// Handle drag and drop
dropZone?.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});

dropZone?.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});

dropZone?.addEventListener("drop", (e: DragEvent) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");

  const file = e.dataTransfer?.files[0];
  if (file) {
    handleFile(file);
  }
});

async function handleFile(file: File) {
  try {
    spinner.style.display = "block";
    result.style.display = "none";

    // @ts-ignore - Electron's File type has path property
    const report = await ipcRenderer.invoke("process-file", file.path);

    result.textContent = JSON.stringify(report, null, 2);
    result.style.display = "block";
  } catch (error) {
    result.textContent = `Error: ${
      error instanceof Error ? error.message : String(error)
    }`;
    result.style.display = "block";
  } finally {
    spinner.style.display = "none";
  }
}
