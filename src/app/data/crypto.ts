import CryptoJS from "crypto-js"

export function encryptData(data: any) {
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    process.env.NEXT_PUBLIC_CRYPT_SECRET!
  ).toString()
  return encryptedData
}

export function decryptData(data: any) {
  if (data !== null) {
    const bytes = CryptoJS.AES.decrypt(data, process.env.NEXT_PUBLIC_CRYPT_SECRET!)
    const decodedData = bytes.toString(CryptoJS.enc.Utf8)
    return JSON.parse(decodedData)
  } else {
    return null
  }
}
