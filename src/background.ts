import { InvoicePdfLink } from './bank'

chrome.runtime.onMessage.addListener(
  function (request, _sender, sendResponse) {
    (async () => {
      const { invoicePdfLinks, clear } = request

      // explicitly requires the "downloads.shelf" permission
      chrome.downloads.setShelfEnabled(false);

      if (invoicePdfLinks) {
        await Promise.all(invoicePdfLinks.map((invoicePdfLink: InvoicePdfLink) => chrome.downloads.download({
          url: invoicePdfLink.link,
          filename: `bookkeeping/seb/seb-${invoicePdfLink.date}.pdf`,
          conflictAction: 'overwrite',
        })))
      }

      /*
        While erase() should merely remove files from the download history, an
        undocumented behavior is that files actually get deleted if erase()
        is called as part of the same user action. This is probably done
        for security reasons.
       */
      if (clear) {
        await chrome.downloads.erase({})
      }

      sendResponse({ success: true })
    })();

    return true
  }
);

export {}
