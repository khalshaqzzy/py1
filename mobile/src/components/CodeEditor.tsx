import React, { useRef, useMemo } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

interface CodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  language?: string;
}

export default function CodeEditor({ code, onChange, language = 'python' }: CodeEditorProps) {
  const webViewRef = useRef<WebView>(null);
  
  // Ambil nilai code awal saat mount untuk dimasukkan ke HTML
  const initialCode = useRef(code);

  // Buat HTML statis (referensi tetap selama CodeEditor tidak unmount)
  const htmlContent = useMemo(() => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/codemirror.min.css">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/theme/dracula.min.css">
      <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/codemirror.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/mode/python/python.min.js"></script>
      <style>
        body, html { margin: 0; padding: 0; height: 100%; background: #121212; overflow: hidden; }
        .CodeMirror { height: 100%; font-family: 'JetBrains Mono', monospace; font-size: 16px; }
      </style>
    </head>
    <body>
      <textarea id="editor"></textarea>
      <script>
        var editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
          mode: 'python',
          theme: 'dracula',
          lineNumbers: true,
          indentUnit: 4,
          tabSize: 4,
          viewportMargin: Infinity,
          extraKeys: {
            "Tab": function(cm) {
              var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
              cm.replaceSelection(spaces);
            }
          }
        });

        // Set nilai awal hanya sekali
        editor.setValue(${JSON.stringify(initialCode.current)});

        editor.on('change', function() {
          window.ReactNativeWebView.postMessage(editor.getValue());
        });
      </script>
    </body>
    </html>
  `, []); // Dependency array kosong agar HTML tidak pernah berubah

  // Memoize source object agar referensinya tetap
  const source = useMemo(() => ({ html: htmlContent }), [htmlContent]);

  return (
    <View className="flex-1 bg-[#121212]">
      <WebView
        ref={webViewRef}
        source={source}
        onMessage={(event) => {
          onChange(event.nativeEvent.data);
        }}
        scrollEnabled={false}
        overScrollMode="never"
        className="flex-1"
        style={{ backgroundColor: '#121212' }}
      />
    </View>
  );
}