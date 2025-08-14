import type { Route } from "./+types/_index";
import DungeonMainPage from "./dungeon._index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dungeon Talk" },
    { name: "description", content: "Welcome to Dungeon Talk!" },
  ];
}

export default function IndexRoute() {
  return <DungeonMainPage />;
}