const Request = require('request').defaults({ encoding: null })
export async function getObjectBase64(url) {
  const options = {
    url: url
  }
  return new Promise((resolve) => {
    Request.get(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        // eslint-disable-next-line new-cap
        const pdfData = 'data:' + 'application/pdf' + ';base64,' + Buffer.from(body).toString('base64')
        resolve(pdfData)
      }
    })
  })
}
//

