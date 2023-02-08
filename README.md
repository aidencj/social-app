# social-app

## 介紹

這是一個簡易的區塊鏈貼文系統，使用者可在App介面上撰寫貼文，後端會將貼文上傳至IPFS，並送將回傳的CID透過智能合約做成NFT。

## 環境

- Node.js 18.14.0
- Solidity：0.8.17
- Dart及相關的dependencies版本則在 `./ios_proj01/pubspec.yaml`

## 使用方式

1. 用終端機在`./ios_proj01/`的路徑下執行`dart pub get`來安裝對應的dependencies
2. 用終端機在`./server/`的路徑下執行`npm install`來安裝對應的modules
3. 透過Remix IDE將 `./smart_contract/PostSystem.sol` 中的 `PostNFT` 部署至鏈上（test net）。(我是使用[Ganache](https://trufflesuite.com/ganache/))
4. 將 `./server/config.json` 中的 3 ~ 4行，依下列指示修改：
    - `ADDRESS`: 改成任一錢包帳戶位置
    - `CONTRACT_ADDRESS`: 改成部署的合約地址
5. 開啟欲使用的模擬器並執行`./ios_proj01/lib/main.dart`即可
