import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  // 루트 레이아웃 - 전체 앱에 적용
  layout("layouts/root-layout.tsx", [
    // 홈 페이지
    index("routes/_index.tsx"),
    
    // 던전 섹션 - 던전 전용 레이아웃 적용
    route("dungeon", "layouts/dungeon-layout.tsx", [
      // 던전 메인 페이지
      index("routes/dungeon._index.tsx"),
      
      // 게임 모드 관련
      route("mode-selection", "routes/dungeon.mode-selection.tsx"),
      
      // 멀티플레이 관련
      route("party-finding", "routes/dungeon.party-finding.tsx"),
      route("multi-play", "routes/dungeon.multi-play.tsx"),
      
      // 싱글플레이
      route("single-play", "routes/dungeon.single-play.tsx"),
      
      // 채팅 데모
      route("chat-demo", "routes/dungeon.chat-demo.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
