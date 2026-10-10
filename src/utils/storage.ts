export const STORAGE_QUOTA_MESSAGE =
  'Browser storage is full (about 5MB total for this site). Vedhaans saves uploaded images locally — try smaller files, paste an image URL instead of uploading, or remove extra banner/background photos in Admin.'

export class StorageQuotaError extends Error {
  constructor(message = STORAGE_QUOTA_MESSAGE) {
    super(message)
    this.name = 'StorageQuotaError'
  }
}

export function setLocalStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch (e) {
    if (
      e instanceof DOMException &&
      (e.name === 'QuotaExceededError' ||
        e.code === 22 ||
        e.code === 1014)
    ) {
      throw new StorageQuotaError()
    }
    throw e
  }
}
