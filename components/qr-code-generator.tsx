"use client"

import { useState, useEffect } from "react"
import QRCode from "qrcode.react"

interface QRCodeGeneratorProps {
  productId: number
  productName: string
}

export default function QRCodeGenerator({ productId, productName }: QRCodeGeneratorProps) {
  const [url, setUrl] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // Get the current domain
    const domain = window.location.origin
    setUrl(`${domain}/products/${productId}`)
  }, [productId])

  const handleDownload = () => {
    const canvas = document.getElementById("product-qrcode") as HTMLCanvasElement
    if (!canvas) return

    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")

    const downloadLink = document.createElement("a")
    downloadLink.href = pngUrl
    downloadLink.download = `${productName.replace(/\s+/g, "-").toLowerCase()}-qrcode.png`
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }

  return (
    <>
      <button onClick={() => setIsModalOpen(true)} className="text-blue-600 hover:text-blue-900 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1zM13 12a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1v-3a1 1 0 00-1-1h-3zm1 2v1h1v-1h-1z"
            clipRule="evenodd"
          />
        </svg>
        QR Code
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">QR Code for {productName}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col items-center justify-center p-4">
              <QRCode id="product-qrcode" value={url} size={200} level="H" includeMargin={true} />
              <p className="mt-4 text-sm text-gray-600 text-center">{url}</p>
            </div>

            <div className="flex justify-center mt-4">
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Download QR Code
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
