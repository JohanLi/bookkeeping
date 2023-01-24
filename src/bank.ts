/*
  My business bank (SEB) charges a monthly fee. The invoices:
    - are located in an obscure section of the website
    - not straightforward to get the invoice for month X
    - have long, meaningless filenames
    - each take 3 seconds to generate, every time, even though they produce the same PDF files

  Ideally: a button press downloads all invoices and gives each PDF file a
  good name.
 */

import { waitUntil } from './common'

async function main() {
  const isInvoicePage = document.querySelector('h1')?.textContent?.trim() === 'Dokument och avtal'

  if (!isInvoicePage) {
    return
  }

  console.log('found invoice page')

  await waitUntil(() => {
    return !!Array.from(document.querySelectorAll('a')).find((link) => link.textContent?.trim() === 'Faktura (pdf)')
  })

  const links = Array.from(document.querySelectorAll('a'))

  const invoicePdfLinks = links.filter((link) => link.textContent?.trim() === 'Faktura (pdf)')

  console.log(invoicePdfLinks)
}

await main()
