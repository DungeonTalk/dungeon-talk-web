import type { Route } from "./+types/_index";
import DungeonTalkMain from "../components/dungeon-talk-main";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dungeon Talk" },
    { name: "description", content: "Welcome to Dungeon Talk!" },
  ];
}

// 서버에서는 빈 데이터만 반환
export function loader() {
  return { ready: false };
}

// 클라이언트에서 실제 데이터 로드
export async function clientLoader() {
  // 클라이언트에서만 실행되는 로직
  return { ready: true };
}

// clientLoader가 hydration 시 실행되도록 설정
clientLoader.hydrate = true;

// 하이드레이션 중 표시할 폴백 컴포넌트
export function HydrateFallback() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  );
}

export default function Index({ loaderData }: Route.ComponentProps) {
  // loaderData.ready가 true일 때만 실제 컴포넌트 렌더링
  if (!loaderData.ready) {
    return <HydrateFallback />;
  }
  
  return <DungeonTalkMain />;
}