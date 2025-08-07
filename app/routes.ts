import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("dungeon", "routes/dungeon.tsx"),
  route("dungeon/mode-selection", "routes/dungeon.mode-selection.tsx"),
  route("dungeon/party-finding", "routes/dungeon.party-finding.tsx"),
  route("dungeon/single-play", "routes/dungeon.single-play.tsx"),
  route("dungeon/multi-play", "routes/dungeon.multi-play.tsx"),
] satisfies RouteConfig;
