/*
  My business bank (SEB) charges a monthly fee. The invoices:
    - are located in an obscure section of the website
    - not straightforward to get the invoice for month X
    - have long, meaningless filenames
    - each take 3 seconds to generate, every time, even though they produce the same PDF files

  Ideally: a button press downloads all invoices and gives each PDF file a
  good name.

  Invoices are found in Kundservice > Dokument & avtal
 */

import { insertClearDownloadsButton, waitUntil } from './common'
import './bank.css'

export type InvoicePdfLink = {
  date: string
  link: string
}

// used as a check in case the results get paginated
const FIRST_INVOICE_DATE = '2021-12-07'

async function main() {
  const isInvoicePage = document.querySelector('h1')?.textContent?.trim() === 'Dokument och avtal'

  if (!isInvoicePage) {
    console.log('Did not detect invoice page, exiting')
    return
  }

  const div = document.createElement('div')
  div.className = 'bookkeepingPopup'
  div.textContent = 'Attempting to find invoices...\n'
  document.body.prepend(div)

  await waitUntil(() => {
    return !!Array.from(document.querySelectorAll('a')).find((link) => link.textContent?.trim() === 'Faktura (pdf)')
  })

  const links = Array.from(document.querySelectorAll('a'))

  const invoicePdfLinks: InvoicePdfLink[] = links.filter((link) => link.textContent?.trim() === 'Faktura (pdf)').map((link) => {
    const date = link.closest('tr')?.querySelector('td[data-th="Datum"]')?.textContent?.trim() || ''

    return {
      date,
      link: link.href,
    }
  })

  if (invoicePdfLinks[invoicePdfLinks.length - 1].date !== FIRST_INVOICE_DATE) {
    div.textContent += 'The last invoice detected is not the first invoice. This script needs to be revised.\n'
    return
  }

  const button = document.createElement('button')
  button.type = 'button'
  button.textContent = `Download ${invoicePdfLinks.length} invoices`

  div.appendChild(button)

  button.addEventListener('click', async () => {
    button.remove()
    div.textContent += 'Downloading...\n'

    const response = await chrome.runtime.sendMessage({ invoicePdfLinks })
    console.log(response);

    div.textContent += 'Downloaded\n'

    insertClearDownloadsButton(div)
  })
}

await main()
