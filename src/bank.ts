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

import { insertClearDownloadsButton } from './common'
import './bank.css'

// This API is called from the Kundservice > Dokument & avtal page
const API_BASE_URL = 'https://ibf.apps.seb.se/dsc/digitaldocuments-corporate/digitaldocuments'

type Document = {
  document_key: string;
  title: string;
  effective_date: string;
}

export type InvoicePdfLink = {
  date: string
  link: string
}

// used as a check in case the results get paginated
const FIRST_INVOICE_DATE = '2021-12-07'

async function main() {
  const div = document.createElement('div')
  div.className = 'bookkeepingPopup'
  div.textContent = 'Attempting to fetch invoices...\n'
  document.body.prepend(div)

  const response = await fetch(API_BASE_URL, { credentials: 'include' })

  if (!response.ok) {
    div.textContent += 'Error. Check the console\n'
    console.log(response)
    return
  }

  const documents = await response.json() as Document[]

  const invoicePdfLinks = documents.filter(({ title }) => title === 'Faktura').map((document) => ({
    link: `${API_BASE_URL}/pdf/${document.document_key}`,
    date: document.effective_date,
  }))

  if (invoicePdfLinks[invoicePdfLinks.length - 1].date !== FIRST_INVOICE_DATE) {
    div.textContent += 'The earliest invoice found does not match the known earliest invoice. This script might need to be updated.\n'
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

    if (response.success) {
      div.textContent += 'Downloaded\n'

      insertClearDownloadsButton(div)
    } else {
      div.textContent += 'Failed: one or more files could not be downloaded\n'
    }
  })
}

await main()
