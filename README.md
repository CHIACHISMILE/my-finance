# MyFinance V1.5.1 — Soft Nordic（藍杏平衡）

由 V1.5 升級：先備份 JSON；在原 GitHub Repository 替換 index.html、sw.js、manifest.json、icon.png。部署完成後關閉並重開，確認設定底部顯示 v1.5.1。已使用 V1.5 安全規則者不必改規則、Firebase、帳本或捷徑。不要刪除 Web App 或清除網站資料。主畫面舊圖示可能由 iOS 快取，不影響功能。若需要更新圖示，先備份 JSON，從 Safari 開啟新網站並加入主畫面（若系統允許），確認新入口的帳本及資料後才移除舊圖示。不要先刪除舊 Web App 或清除網站資料。

預設分類配色更新，自訂分類已儲存的顏色及圖示保持原樣。財務邏輯、資料格式、登入及 API 路徑不變。

# MyFinance V1.5 — 帳本與智慧分類

## 更新（由 V1.4 升級）
1. 如舊版可開啟，先匯出 JSON 備份並存到私人 iCloud Drive。
2. Firebase Console → Firestore Database → Rules，備份原規則，再貼上本版 firestore.rules 並 Publish。若原規則曾自行修改，先合併而非直接覆蓋。
3. 原 GitHub Repository 替換 index.html、sw.js，確認 Pages 部署成功。
4. 完全關閉 Web App 後重開，設定底部應顯示 v1.5。不要刪除 Web App 或清除網站資料。
5. 使用同一 Firebase 專案與 Google 帳號登入，設定的「我的帳本」應列出本人擁有及受邀的帳本。失敗時仍可手動輸入 ID，或在 Firebase Data → workspaces 找回。
6. 用假交易測試，再輸入真實財務資料。

## 帳本與資安
- 每人建立自己的私人帳本；共同帳本由其中一人建立、以另一人 UID 授予 Editor。每本帳本獨立。
- Owner / Editor / Viewer / Recorder 原權限不變。新版只允許帶有本人 owner / member 條件的帳本清單查詢；Recorder 不可讀取。釘選偏好為本人專屬。
- 不要把帳本 JSON、捷徑密碼、服務帳戶私鑰上傳 GitHub。
- 原交易及帳戶格式維持；自訂圖示存放在 categories.__styles。新資料不應使用舊版還原功能。
- 合併淨資產、跨帳本轉帳及分攤結算尚未實作；不要把同一資產或同一筆消費重複記入私人及共同帳本後相加。
- 捷徑原 API 路徑與交易欄位不變；如需新分類，重新匯出捷徑設定。捷徑目前仍以匯出設定為準，不會自動更新清單。
- 真實 Firestore 權限、兩機登入與 iOS 實機顯示仍待驗收。不要以正式財務資料測試。
