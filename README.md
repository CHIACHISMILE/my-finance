# MyFinance V2.6 — P0/P1 驗收版

沿用 V2.5 資料模型及 Firebase 權限。六個部署檔：index.html、offline.js、reports.js、sw.js、manifest.json、icon.png。不要把備份資料、捷徑設定檔、登入密碼或服務帳戶金鑰上傳 GitHub。

先在不同網域（不同 origin）以本機範例資料測試。相同 github.io 網域下的不同 repo 不代表 localStorage/IndexedDB 隔離。正式更新前先確認兩台手機待同步為 0 並分別備份每本帳本；建議在兩台裝置都測完後才正式使用。現有 V2.5 Firestore Rules 沿用，未修改；請勿將規則改為公開讀寫。若目前使用的是較舊規則，先比對 firestore.rules；不要盲目覆蓋自訂規則。

開啟 GitHub Pages 網址，確認設定顯示 v2.6；若仍是舊版，先保持連線重新載入並完全關閉 Web App，再開啟。不要刪除網站資料或舊 App，尤其有待同步交易時。原 Firebase 專案、帳號、帳本 ID 與捷徑 REST 資料格式均不變。此版本未連線實際專案或部署網站。

詳見「使用手冊.html」及 TEST-REPORT.md。原生捷徑沿用 SHORTCUTS-SETUP.md 的流程（須連線）。
