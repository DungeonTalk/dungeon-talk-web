
export function loader() {
  // Chrome DevTools 관련 요청에 대해 빈 JSON 응답 반환
  return new Response(JSON.stringify({}), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export default function DevTools() {
  // 이 컴포넌트는 실제로 렌더링되지 않습니다
  return null;
}