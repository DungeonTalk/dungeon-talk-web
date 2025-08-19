/*
 * 이 파일은 서버 사이드 렌더링(SSR)을 위한 엔트리 포인트입니다.
 * 현재 React 19 및 관련 라이브러리의 SSR 변경사항으로 인해 문제가 발생하고 있습니다.
 * 이 문제를 우회하고 클라이언트 사이드 렌더링으로 진행하기 위해 SSR 로직을 주석 처리하고
 * 임시 HTML을 반환하도록 설정합니다.
 */

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
) {
  // SSR 로직을 완전히 비활성화하고, 클라이언트에서 로드될 최소한의 HTML을 반환합니다.
  const tempHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Loading...</title>
      </head>
      <body>
        <div id="root"></div>
        <script type="module" src="/src/entry.client.tsx"></script>
      </body>
    </html>
  `;

  return new Response(tempHtml, {
    headers: { "Content-Type": "text/html" },
    status: responseStatusCode,
  });
}
