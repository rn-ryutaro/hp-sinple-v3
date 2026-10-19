S.M.HP 建設業シンプルプラン(デモサイト:株式会社 蒼杜建設)
==========================================================

■ フォルダ構成
  index.html        TOPページ
  services.html     事業内容ページ
  company.html      会社概要ページ
  css/style.css     デザイン(色・文字・レイアウト)
  js/site-config.js 会社情報の入力ファイル ← お客様情報はここに入力
  js/main.js        共通の動き(ページ遷移時のスクロール位置、メニュー、情報反映)
  images/           写真(WebP形式)

■ 確認方法
  index.html をブラウザ(Chrome / Edge / Safari など)で開くと確認できます。
  ※文字のフォント(Google Fonts)はインターネット接続時に読み込まれます。

■ 会社情報の差し替え
  js/site-config.js を開き、'' の中に入力して保存してください。
  全ページの「○○を入力」欄にまとめて反映されます。
  ・電話番号とメールアドレスは、入力されたときだけ発信/メール作成のリンクになります。
    空欄のままなら押しても何も起きません(誤発信・誤送信防止)。
  ・建設業許可番号は任意です。不要な場合は会社概要・事業内容ページの該当行を削除してください。
  ・会社名を変える場合は、各HTMLのロゴ・タイトル部分(「蒼杜建設」「蒼」)も変更してください。

■ 写真の差し替え
  images/ 内の同じファイル名で上書きすると差し替えできます。
  横長の写真を推奨(TOPメイン:横1600px程度)。
  現在の写真はすべてイメージ写真です。実際の施工写真に差し替えるまでは
  「※写真はイメージです」の表記を残してください。

  使用写真:Unsplash(Unsplash License/商用利用可・クレジット表記不要)
    hero-top.webp            photo-1541888946425-d81bb19240f5
    top-building.webp        photo-1671224591216-00986cc87cf2
    top-civil.webp           photo-1503708928676-1cb796a0891e
    top-renovation.webp      photo-1504964670878-71b73cec0ce1
    image-wide.webp          photo-1599995903128-531fc7fb694b
    hero-service.webp        photo-1485083269755-a7b559a4fe5e
    service-building.webp    photo-1531834685032-c34bf0d84c77
    service-civil.webp       photo-1517089596392-fb9a9033e05b
    service-renovation.webp  photo-1653837105223-63912447c7a0
    hero-company.webp        photo-1546414701-81cc6963c67f
    company-intro.webp       photo-1504307651254-35680f356dfd
  (https://unsplash.com/license)

■ 公開時の注意
  各HTMLの <meta name="robots" content="noindex"> はデモ用の検索除外設定です。
  実際のお客様サイトとして公開するときは、この行を削除してください。
  画面上部の「デモ」帯(class="demo-strip")と、フッターの「ホームページ制作見本」表記も削除してください。

■ ページ遷移とスクロール位置について
  別ページへ移動したときは、必ずページの一番上(ヘッダー)から表示されます。
  処理は js/main.js の「1. ページ遷移時は必ず一番上から表示する」に共通化しています。
  ページを追加する場合も、同じ main.js を読み込めば同じ動作になります。
  ・リンクは「services.html」のように通常のページリンクで書いてください(href="#" は使わない)。
  ・CSS の html に scroll-behavior: smooth は指定しないでください。
  ・ブラウザの「戻る・進む」は、ブラウザ標準どおり直前の位置に戻ります。
