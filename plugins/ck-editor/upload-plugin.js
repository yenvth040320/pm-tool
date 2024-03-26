/**
 * Upload adapter
 */
class UploadAdapter {
  constructor(loader, fn) {
    this.loader = loader
    this.fn = fn
  }

  /**
     * Upload process
     */
  async upload() {
    try {
      const file = await this.loader.file
      let path = await this.fn(file)
      path = process.env.API_ROOT_URL + path
      return { default: path }
    } catch (err) {
      throw new Error(err)
    }
  }
}

/**
     * Init upload adapter
     *
     * @param {Object} editor
     * @param {Function} fn
     */
export default function uploadPlugin(editor, fn) {
  editor.plugins.get('FileRepository').createUploadAdapter = loader => new UploadAdapter(loader, fn)
}
