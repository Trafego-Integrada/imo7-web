import { MutableRefObject } from "react";

export function usePrint() {
    function handlePrint(contentRef: MutableRefObject<any>, title?: string) {
        const contentToPrint = contentRef.current;

        const printableContent = `
      <html>
        <head>
          <title>${title}</title>
          <style>
            body{
                display: flex;
                justify-content: center;
                align-items: center;
            }
            img{
                max-width: 100vw;
            }
          </style>
        </head>
        <body>
            ${contentToPrint.innerHTML}
        </body>
      </html>
    `;

        if (typeof window !== 'undefined') {
            const windowContent = window.open('', '_blank');
            windowContent?.document.write(printableContent);
            windowContent?.print()
            windowContent?.addEventListener('afterprint', () => windowContent.close())
        }
    };

    return {
        handlePrint
    }
};
