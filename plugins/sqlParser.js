import SQLParser from 'node-sql-parser'
export default (context, inject) => {
  const parser = new SQLParser.Parser()

  // Đăng ký SQL parser như một inject trong context của Nuxt.js
  inject('sqlParser', {
    parse: sql => parser.astify(sql)
  })
}
