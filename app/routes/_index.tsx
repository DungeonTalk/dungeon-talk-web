
import type { Route } from "./+types/_index";
import { Link, useNavigate } from "react-router";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Dungeon Talk" },
    { name: "description", content: "Welcome to Dungeon Talk!" },
  ];
};

export default function Home() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    console.log("로그인 버튼 클릭됨!");
    navigate("/signin");
  };

  const handleDungeonClick = () => {
    console.log("던전 입장 버튼 클릭됨!");
    navigate("/dungeon");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center gap-5">
      <h1 className="text-4xl font-bold">Dungeon Talk</h1>
      <p className="text-lg">던전 톡에 오신 것을 환영합니다!</p>
      
      <div className="flex gap-3">
        <button 
          onClick={handleLoginClick}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          로그인
        </button>
        
        <button 
          onClick={handleDungeonClick}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
        >
          던전 입장
        </button>
      </div>
      
      <p className="text-sm text-gray-400">
        React Router v7 SSR 모드 - 네비게이션 가능
      </p>
    </div>
  );
}