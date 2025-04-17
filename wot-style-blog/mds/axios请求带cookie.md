---
date: 2020-02-09
categories: [技术,前端,杂项]
---
# axios请求默认不带cookie
axios默认是发送请求的时候不会带上cookie的，这导致当服务器使用session来保存登录态时，客户端永远无法登陆的情况。

```javascript
import axios from 'axios'; // 引入axios

axios.defaults.withCredentials = true; // 允许携带cookie
```
这样即可解决
