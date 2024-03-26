# nuxt-base

## Cài đặt
- nodejs cài đặt phiên bản nodejs version 14 (lý do xem chú thích bên dưới)

- Chạy `yarn` để cài đặt các package cần thiết
- Note: frontend branch base/laravel8_with_repos_service using with api base/laravel8_with_repos_service branch on https://gitlab.com/digidinosvn/t-rex-php-api

- Trong package.json sử dụng thư viện ["node-sass": "^4.14.1"], tuỳ theo version của node-sass sẽ hỗ trợ các version nodejs khác nhau.
  tham khảo: [link này](https://www.npmjs.com/package/node-sass) mục [Supported node-sass version]
  ví dụ: version ["node-sass": "^4.14.1"] thì chỉ hỗ trợ với nodejs version 14
- Ngoài ra ["nuxt": "^2.13.0"] cũng khuyến nghị dùng nodejs version 14 
  tham khảo: [link này](https://nuxtjs.org/docs/get-started/installation/#prerequisites)

## Sử dụng

- Mở file **.env** và sửa giá trị `API_BASE_URL` thành URL của API
- Chạy `yarn dev` để develop dự án
- Chạy `yarn generate` để build dự án

## Hướng dẫn

1. Khắc phục lỗi component chưa được khai báo

Mở file `plugins/antd` và kiểm tra xem component cần tìm có tồn tại trong dánh sách import không. Nếu chưa có thì mở [link này](https://github.com/vueComponent/ant-design-vue/blob/master/components/index.js) và tìm component tương ứng rồi import vào. Lưu ý: Do kích cỡ thư viện là rất lớn nên vui lòng **KHÔNG IMPORT TOÀN BỘ THƯ VIỆN** như thế này: `import Antd from 'ant-design-vue'`. Trên trang chủ của ANTD cũng đã có giải thích về [vấn đề này](https://antdv.com/docs/vue/getting-started/#Import-on-Demand)

2. Cách sử dụng plugin API

- Plugin API được inject thông qua thuộc tính `$api`
- Các phương thức có sẵn: `list`, `create`, `show`, `update`, `delete`
- Có 2 cách để khai báo một repository mới:

* Sử dụng `make` nếu chỉ cần tạo mới repository với những phương thức có sẵn:

```javascript
{
  order: make($axios, "order");
}
```

- Sử dụng `bind` nếu muốn tạo mới một repository với các phương thức mở rộng:

```javascript
{
  product: bind($axios, ProductRepository);
}
```

- Ví dụ sử dụng:

```javascript
this.$api.order.list();
this.$api.product.show(id);
```

3. Hướng dẫn cài https và dùng domain

- Mở `cmd` và cài lệnh sau để cài tool generate ra certificate

```
choco install mkcert
```

- Chạy lệnh sau để generate ra certificate

```
cd [thư mục dự án]
mkcert -key-file nurse-craft-key.pem -cert-file nurse-craft-cert.pem nurse-craft.com *.nurse-craft.com
```

- Trỏ domain vào localhost
  Thêm giá trị sau vào file hosts. Vào thư mục C:\Windows\System32\drivers\etc và thêm dòng:

```
127.0.0.1      nurse-craft.com
```

- Thay đổi nội dung file `nuxt.config.js`

```javascript
  axios: {
    baseURL: process.env.API_BASE_URL,
    https: false => Thêm dòng này vào để vẫn gọi http lên API
  },
```

- Thêm phần cấu hình cho server để đọc file certificate trong file `nuxt.config.js`

```javascript
  import path from 'path'
  import fs from 'fs'


  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'nurse-craft-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'nurse-craft-cert.pem'))
    }
  },
```

- Thay đổi trong file `package.json` mỗi khi build tự động

```javascript
"dev": "nuxt --host nurse-craft.com --https --ssl-key nurse-craft-key.pem --ssl-cert nurse-craft-cert.pem",
```

- Mở browser sử dụng https

```
https://nurse-craft.com:3000/
``` 
