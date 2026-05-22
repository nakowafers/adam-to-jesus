'use client';


export function KofiButton() {
  const kofiId = 'B0B21YOXXP';
  const buttonText = 'Support me on Ko-fi';
  const buttonColor = '#ff6700';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; overflow: hidden; background: transparent; }
          .kofi-button { display: inline-block; }
        </style>
      </head>
      <body>
        <script type='text/javascript' src='https://storage.ko-fi.com/cdn/widget/Widget_2.js'></script>
        <script type='text/javascript'>
          kofiwidget2.init('${buttonText}', '${buttonColor}', '${kofiId}');
          kofiwidget2.draw();
        </script>
      </body>
    </html>
  `;

  return (
    <div className="w-full flex justify-center py-2">
      <iframe
        srcDoc={htmlContent}
        title="Ko-fi Support Button"
        style={{ border: 'none', width: '220px', height: '50px' }}
        scrolling="no"
      />
    </div>
  );
}
