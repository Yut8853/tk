木崎つかさ ポートフォリオサイト
================================

■ Vercelでの公開
公開先URL：https://tk.junkbranding.com/
静的HTMLの1ページ構成です。PHP・環境変数・ビルド処理は不要です。
vercel.json を含むこのフォルダをVercelプロジェクトのルートにしてください。
Framework Preset：Other／Build Command：空欄／Output Directory：.
.vercelignore で資料・検証スクリプト・Apache用設定を公開対象から除外します。

■ ドメインの接続（Vercel側で実施）
1. プロジェクトの Settings > Domains に tk.junkbranding.com を追加。
2. junkbranding.com のDNS管理画面で、ホスト名 tk のCNAMEを、
   VercelのDomains画面に表示される接続先に設定。
   プロジェクトごとに値が異なるため、画面に出た値を使用してください。
3. Vercelでドメインの接続とHTTPS証明書が有効になったことを確認。
サイト内のcanonicalとog:urlは https://tk.junkbranding.com/ に設定済みです。
このファイル更新だけでは、Vercelの公開やDNSの変更は行われません。
公式手順：https://vercel.com/docs/domains/working-with-domains/add-a-domain

■ 検索エンジン対策（noindex）
・index.html の noindex / nofollow 等のmetaタグを維持しています。
・Vercelでは vercel.json のheadersで画像・動画も含めて
  X-Robots-Tag: noindex, nofollow, noarchive, noimageindex を付けます。
・.htaccess はApache向けの旧設定です。Vercelでは使用しません。

■ お問い合わせ
「メールで相談する」ボタンとメールアドレスをクリックすると、
利用者が設定しているメールアプリで下書きを開きます。
宛先：kominira53@gmail.com
件名：お仕事のご相談
送信は利用者のメールアプリで行います。
入力フォーム・送信用PHP・フォームの送信処理は削除済みです。

■ ファイル構成
assets/imgs/thumbs   … 一覧用サムネイル
assets/imgs/works    … 拡大表示用のLP画像（長いページは分割）
assets/imgs/video    … 動画のサムネイル
assets/video         … 動画（Web用に圧縮済み）
assets/css/portfolio.css … 追加したスタイル（テンプレートの style.css は未変更）
assets/js/portfolio.js   … 拡大表示・動画再生の処理

■ バナー・動画バナー追加（2026-10-08）
・バナー.zip の静止画68点を確認し、完全一致の重複2点をまとめて66点追加。
  既存8点を含め、Bannersで74点を掲載しています。
・ZIP内の動画30点のうち、掲載済み11点を再利用し、19点を追加しました。
  Video Banner Collectionから30点すべてを閲覧できます。
・各一覧はブランド・カテゴリーで絞り込み、12点ずつ追加表示できます。
・一覧は画像全体を表示し、クリックで拡大または動画再生します。
・追加動画はH.264/AAC・最大辺1280px・ストリーミング用の形式に圧縮。
  新規動画19点の合計は約416MBから約52MBになっています。
・assets/imgs/banners … 静止画と一覧用サムネイル（JPEG）
・assets/imgs/video/banners … 新規動画のサムネイル
・assets/video/banners … 新規動画
・assets/data/banner-media.json … ZIP内の原名・寸法・ハッシュ・掲載先・重複の対応表

■ 追加部分の確認
python3 scripts/verify-media.py
node scripts/verify-gallery.cjs
※参照ファイル・HTML構造・一覧操作のロジックを検証します。
  ブラウザでのレイアウト・実再生の確認は別途必要です。

■ 読み込み・ページ内移動の修正
・全画面Loading演出を撤去し、ページを直接表示します。
・ScrollSmootherとscrollItの併用をやめ、hrefによる標準アンカーに統一しました。
・移動先の上部に余白を設け、固定ナビで見出しが隠れないようにしています。
・動画一覧・大型プレビュー・縦型スライダーはサムネイル表示に変更。
  動画本体はクリックして再生画面を開いたときだけ読み込みます。
・スマホメニューの開閉とaria-expandedを同期します。

■ 遷移後のスクロールの追加修正
・ページに不要なScrollTriggerの固定・位置補正処理とライブラリ読み込みを撤去。
・拡大画面のフォーカス移動・復帰でスクロール位置を変更しないよう調整。
・拡大画面のスクロールが背面ページへ伝わらないよう調整。
・変更したCSS/JSに内容ハッシュを付け、古いキャッシュの再利用を防止。
・ローカルChromeの1440px/390px幅で、全メニュー移動後のスクロール、
  画面高変更、長いLPの閲覧・閉じる操作、絞り込み・追加表示を確認済み。
  Safariなど他ブラウザは未確認。
