const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024 // 2MB

export type ImageUploadResult =
  | { ok: true; dataUrl: string }
  | { ok: false; error: string }

export function processImageFile(
  file: File,
  maxDimension = 480
): Promise<ImageUploadResult> {
  return new Promise((resolve) => {
    if (!VALID_IMAGE_TYPES.includes(file.type)) {
      resolve({
        ok: false,
        error: 'Định dạng ảnh không hợp lệ. Chỉ hỗ trợ JPG, PNG hoặc WEBP.',
      })
      return
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      resolve({
        ok: false,
        error: 'Dung lượng ảnh vượt quá 2MB. Vui lòng chọn ảnh nhẹ hơn.',
      })
      return
    }

    const reader = new FileReader()
    reader.onerror = () => {
      resolve({
        ok: false,
        error: 'Không thể đọc tệp ảnh này. Vui lòng thử lại với ảnh khác.',
      })
    }
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => {
        resolve({
          ok: false,
          error: 'Tệp ảnh bị lỗi hoặc không thể giải mã.',
        })
      }
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width)
            width = maxDimension
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height)
            height = maxDimension
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve({
            ok: false,
            error: 'Trình duyệt không hỗ trợ xử lý ảnh.',
          })
          return
        }
        ctx.drawImage(img, 0, 0, width, height)
        const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
        const dataUrl = canvas.toDataURL(outputType, 0.85)
        resolve({ ok: true, dataUrl })
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}

