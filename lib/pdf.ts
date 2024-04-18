import { renderToStaticMarkup } from 'react-dom/server'
import pdf from 'html-pdf'

const componentToPDFBuffer = (component: any) => {
    return new Promise((resolve, reject) => {
        const html = renderToStaticMarkup(component)

        const options: any = {
            type: 'pdf',
            timeout: 30000,
        }

        const buffer = pdf
            .create(html, options)
            .toBuffer((err: any, buffer: any) => {
                if (err) {
                    return reject(err)
                }

                return resolve(buffer)
            })
    })
}

export default {
    componentToPDFBuffer,
}

