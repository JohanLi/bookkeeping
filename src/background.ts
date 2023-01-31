import { InvoicePdfLink } from './bank'
import { download } from './download';

chrome.runtime.onMessage.addListener(
  function (request, _sender, sendResponse) {
    (async () => {
      const { invoicePdfLinks, clear } = request

      if (invoicePdfLinks) {
        try {
          await download(invoicePdfLinks.map((invoicePdfLink: InvoicePdfLink) => ({
            url: invoicePdfLink.link,
            filename: `bookkeeping/seb/seb-${invoicePdfLink.date}.pdf`,
          })))

          sendResponse({ success: true })
        } catch(e) {
          sendResponse({ success: false })
          console.log(e)
        }
      }

      /*
        While erase() should merely remove files from the download history, an
        undocumented behavior is that files actually get deleted if erase()
        is called as part of the same user action. This is probably done
        for security reasons.
       */
      if (clear) {
        await chrome.downloads.erase({})
        sendResponse({ success: true })
      }
    })();

    return true
  }
);

export {}
