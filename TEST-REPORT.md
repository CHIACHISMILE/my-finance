# MyFinance V2.1 測試報告

## 已執行
- Node VM：28 項邏輯測試通過（`node test-logic.cjs`）。包含原 V2.0 的 15 項本機／模擬離線與同步測試、13 項新增估值與帳戶、分類測試。IndexedDB 以記憶體模擬，並非實際持久化測試。
- `node --check sw.js`、`node --check offline.js` 通過。
- Chromium 402×874 手機 viewport，以 set_content 和模擬 localStorage 載入實際 HTML，成功開啟記帳及估值頁，取得選中 icon 與日期欄位 bounding boxes，輸出兩張預覽。日期輸入框垂直居中（51px 容器、36px 控制項、上下各 7.5px）；未測 iOS WebKit。實際 file:// 導航遭環境政策阻擋，未測真實 service worker 或 IndexedDB。

## 仍需驗證
- Firebase 安全規則僅靜態檢查，未部署或執行 emulator 驗證。先在測試帳本驗證 Owner、Editor、Viewer、Recorder；Recorder 無權編輯帳戶，封存帳戶不可新增交易。
- iPhone PWA 日期置中、分類滑動、飛航模式及多人同步。
- 絕對估值在本機換算為差額，不是雲端原子覆蓋。已知本機餘額變動時阻擋儲存；無法防止其他裝置尚未同步的變動，需同步後核對。
- 封存不是實體刪除；仍有餘額的封存帳戶繼續計入總額。修改起始餘額會影響歷史圖表。分類改名保留底層分類鍵，舊版與捷徑仍可能顯示原名。
