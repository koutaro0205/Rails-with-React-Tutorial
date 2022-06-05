module.exports = {
  root: true,
  extends: ['airbnb', 'airbnb/hooks'],
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/function-component-definition': [
      1,
      { namedComponents: 'arrow-function' },
    ],
    'no-console': 0,
    'no-alert': 0,
  },
};

// このファイルは、インストールしたAirbnbのルールセットを使ってReactフックのルールのlintを有効にするようESLintに指示します。また、拡張子が.jsのファイルにJSXコードを含められるようにする指定、consoleやalertで警告を出さないようにする指定、そして関数コンポーネントでアロー関数（=>）構文を利用できるようにする設定も行います。