# FRAME LUNCH scaffold for frontend development

## Requierment

* macOS: >= `10.12`
    * or Ubuntu `16.04`
* Node: >= `v8.9`
* yarn: >= `0.24.5`
    * or npm >= `3.10.10`

### Optionals

## How to use

```bash
# install npm packages
yarn
# start watch & development server
yarn start
# create production files
yarn build
# create difference production files
yarn build:diff <CHECKOUT_TARGET ex:commitid, tagname, branch...>
# check JavaScript types
yarn typecheck
# check codes quality
yarn lint
# check build files
yarn build:check
```

## Important Technology

### Node.js manager

* [ndenv](https://github.com/riywo/ndenv)

### Package manager

* [yarn (recommend)](https://yarnpkg.com/)
* [npm](https://www.npmjs.com/)

### Task runner

* [Gulp](http://gulpjs.com/)

### Build tools

#### JavaScript

* [Webpack](https://webpack.github.io/)
* [babel](https://babeljs.io/)
    * [babel-preset-flow](https://github.com/babel/babel/tree/master/packages/babel-preset-flow)
    * [babel-preset-env](https://github.com/babel/babel-preset-env)
    * [babel-plugin-transform-object-rest-spread](https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-object-rest-spread)
    * [babel-plugin-date-fns](https://github.com/date-fns/babel-plugin-date-fns)

JSから以下のファイルをimportすることが可能なため、ケースバイケースで使用すると良

* 画像ファイル(`jpg`, `gif`, `png`, `svg`) svgはテキストとして、それ以外はinline化される
* プレーンテキスト(`txt`, `log`)
* JSON(`json`)
* CSS(`css`)

#### CSS

* [PostCSS](http://postcss.org/)
    * [autoprefixer](https://github.com/postcss/autoprefixer)
    * [css-mqpacker](https://github.com/hail2u/node-css-mqpacker)
    * [postcss-fixes](https://github.com/mattdimu/postcss-fixes)
    * [postcss-custom-media](https://github.com/postcss/postcss-custom-media)
    * [postcss-custom-properties](https://github.com/postcss/postcss-custom-properties)
    * [postcss-import](https://github.com/postcss/postcss-import)
    * [postcss-loader](https://github.com/postcss/postcss-loader)
    * [postcss-nested](https://github.com/postcss/postcss-nested)
    * [postcss-url](https://github.com/postcss/postcss-url)

`background-image` などのCSSでのurl指定を相対パスで行った場合、inline化される。

#### html

* [EJS](http://www.embeddedjs.com/)

ビルド時にオプション値 `/site-config.json` が読み込まれるので適宜利用する

### Code checker

#### JavaScript

* [flow](https://flow.org/)
* [ESLint](http://eslint.org/)
    * [eslint-config-framelunch](https://github.com/framelunch/eslint-config-framelunch)

#### CSS

* [stylelint](https://stylelint.io/)
    * [stylelint-config-framelunch](https://github.com/framelunch/stylelint-config-framelunch)

### Code formatter

* [Prettier](https://github.com/prettier/prettier) target filetypes ⬇️
    * `.js`
    * `.jsx`
    * `.css`
    * `.json`

## Directory Layout

```text
.
|- /.github/                # GitHub用issue, PRテンプレ
|- /assets/                 # 静的リソース build時にそのままrootに展開されます
|- /build/                  # yarn buildコマンドで生成されるコンパイル済みファイル
|- /flow-typed/             # flowtype用型ファイル(自動生成ディレクトリ)
|- /node_modules/           # 3rd-party libraries and utilities for nodeJs
|- /src
|    |- /assets/            # JSから直接importする静的リソース
|    |- /components/        # WEBコンポーネント
|    |- /scripts/           # Javascriptのエントリーディレクトリ
|    |- /styles/            # CSSのエントリーディレクトリ
|    |- /views/             # EJSのエントリーディレクトリ
|    |- site-config.json    # EJSビルド時に渡されるオプション値 metaタグなどに使うこと想定
|- /tools/                  # ビルドツール関連
|    |- /gulp/              # gulpタスクを記述したjs。タスクごとに1ファイルとする
|    |- /webpack/           # webpackビルド設定
|    |- /config.js          # ビルド関係設定ファイル
|- .eslintignore            # eslintから除外するファイル
|- .eslintrc                # eslint設定ファイル
|- .flowconfig              # flowtype設定ファイル
|- .gitattributes           # git設定 yarn.lockをバイナリ扱いなど
|- .gitignore               # git管理対象外を記述
|- .node-version            # ndenv用のバージョン指定
|- .prettierignore          # prettier対象除外設定
|- .prettierrc              # prettier設定
|- .stylelintrc             # stylelint設定ファイル
|- gulpfile.js              # gulp実行ファイル
|- package.json             # The list of 3rd party libraries for nodeJs
|- README.md                # README
|- yarn.lock                # yarn用利用npmsバージョン管理ファイル
```

## Settings

* `package.json` のbrowserslistに対応するブラウザを書く
* ProjectのSettingでsrcディレクトリをrootに設定する
* viewファイルから読み込むassetは必ず絶対パスで記述する

### Prettierのすすめ

commit時に勝手にコードを整形してくれる。

エディタを設定すると保存時にもいい感じに整形してくれる。

#### VSCode設定

1. [拡張](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)を入れる
1. ローカル設定に以下を追加

```json
{
  // prettier
  "[javascript]": {
    "editor.formatOnSave": true
  },
  "[css]": {
    "editor.formatOnSave": true
  },
}
```

グローバル設定をどうするかは人によりますが、falseにしといたほうがいいと思います。他のプロジェクトで適当に整形されたりするので。

#### IntelliJ設定

拡張を入れて色々やるといいらしいです(未検証)

### Spreadsheet setting

Google スプレッドシートからJSONを作成するとっかかりを仕込んであるので、必要な場合は利用する。
何も考えずにJSON化するだけなので、文字列を数値に変更するなどの加工が必要な場合は別途スクリプトを作ること。

1. スプレッドシートをあらかじめ作成しておき、共有の設定を行っておく
1. [Google Developer console](https://console.developers.google.com/)よりサービスアカウントキーを取得する。[参考](http://www.yoheim.net/blog.php?q=20160411)
    * 取得するアカウントについては個人のものより共用のものが望ましい。
1. `tools/serviceAccountKey.json` に保存する。__Git管理から除外しているので注意すること__
1. `tools/config.js` で対象のシートの指定、列の設定を行う。

## Coding guides

原則として、 __モダンかつ読みやすいコーディング__ を心がける

以下については本当に基礎的な話だけ

### JavaScript

* ES2015+
* 日時の計算や文字列化は `date-fns` を使う
* 複雑になってきたらなるべく型をつける

### CSS

* PostCSS
* 基本的にBEM
    * [細かすぎるけど伝わってほしい私的BEMプラクティス30（ぐらい）](https://necomesi.jp/blog/tsmd/posts/152) が最近だと参考になった
* 他にもコーディングルールとして[ECSS](http://ecss.io/)をつかうと良いかも…(難しいけど)

### HTML

* html5
* 無理筋なタグの使い方をしない
    * [インクルーシブHTML+CSS & JavaScript](https://www.amazon.co.jp/dp/4862463878/)を参考に。
    * [コーディングWebアクセシビリティ](https://www.amazon.co.jp/dp/4862462669/)もより専門的だが非常に参考になる
