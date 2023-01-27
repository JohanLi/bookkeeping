import { InvoicePdfLink } from './bank'

chrome.runtime.onMessage.addListener(
  function (request, _sender, sendResponse) {
    (async () => {
      const { invoicePdfLinks, clear } = request

      if (invoicePdfLinks) {
        await Promise.all(invoicePdfLinks.map((invoicePdfLink: InvoicePdfLink) => chrome.downloads.download({
          url: invoicePdfLink.link,
          filename: `bookkeeping/seb/seb-${invoicePdfLink.date}.pdf`,
          conflictAction: 'overwrite',
        })))
      }

      if (clear) {
        await chrome.downloads.erase({})
      }

      sendResponse({ success: true })
    })();

    return true
  }
);

export {}
