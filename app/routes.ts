import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("signin", "routes/signin.tsx"),
  route("signup", "routes/signup.tsx"),
  route("dungeon", "routes/dungeon._index.tsx"),
  route("dungeon/websocket-test", "routes/dungeon.websocket-test.tsx"),
  route("dungeon/chat-demo", "routes/dungeon.chat-demo.tsx"),
  route("dungeon/mode-selection", "routes/dungeon.mode-selection.tsx"),
  route("dungeon/multi-play", "routes/dungeon.multi-play.tsx"),
  route("dungeon/party-finding", "routes/dungeon.party-finding.tsx"),
  route("dungeon/single-play", "routes/dungeon.single-play.tsx"),
  // Chrome DevTools 관련 경로 처리
  route(".well-known/appspecific/com.chrome.devtools.json", "routes/devtools.tsx"),
] satisfies RouteConfig;
