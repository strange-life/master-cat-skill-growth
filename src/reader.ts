export function readAsText(blob: Blob | File, encoding?: string) {
  return new Promise<string | null>(function (resolve, reject) {
    const reader = new FileReader();

    reader.onload = function () {
      resolve(this.result as string | null);
    };

    reader.onerror = function () {
      reject(this.error);
    };

    reader.readAsText(blob, encoding);
  });
}
