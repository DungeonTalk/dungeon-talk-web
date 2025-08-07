import type { Route } from "./+types/_index";
import { redirect } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dungeon Talk" },
    { name: "description", content: "Welcome to Dungeon Talk!" },
  ];
}

// 서버에서 /dungeon으로 리디렉션
export function loader() {
  return redirect("/dungeon");
}