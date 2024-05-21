import * as XLSX from 'xlsx/xlsx.mjs'
import { saveAs } from 'file-saver'

export { XlsxDownload }

function XlsxDownload(data: object[], name: string) {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);

  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  XLSX.writeFile(wb, name); // xlsx has buildin ways to download files from browser
}
