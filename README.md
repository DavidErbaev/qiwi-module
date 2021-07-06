# QIWI-MODULE

## Description

>[RU] Модуль предназначен для работы с QIWI API благодаря фреймворку Node.JS</br>
>[EU] The module is designed to work with the QIWI API thanks to the Node.JS framework

```bash
npm i qiwi-module
```

## Example

```js
const { Qiwi } = require("qiwi-module");
const wallet = new Qiwi({ token: process.env.TOKEN })

(async () => {
     let profile = await wallet.api.getAccountInfo()
    
     console.log(profile)
})
```
