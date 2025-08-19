
import type { Route } from "./+types/_index";
import { Link, useNavigate } from "react-router";
import {useEffect} from "react";
import { useAuth } from "@/hooks/useAuth";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Dungeon Talk" },
    { name: "description", content: "Welcome to Dungeon Talk!" },
  ];
};

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // 로딩이 완료되고 인증되지 않은 경우 로그인 페이지로 리다이렉트
    if (!isLoading && !isAuthenticated) {
      navigate("/signin");
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleLoginClick = () => {
    console.log("로그인 버튼 클릭됨!");
    navigate("/signin");
  };
  const handleDungeonClick = () => {
    console.log("던전 입장 버튼 클릭됨!");
    navigate("/dungeon");
  };

  // 로딩 중일 때 표시할 UI
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center">
        <p>로딩 중...</p>
      </div>
    );
  }

  // 인증된 사용자에게만 표시되는 홈 페이지
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center gap-5">
      <h1 className="text-4xl font-bold">Dungeon Talk</h1>
      <p className="text-lg">던전 톡에 오신 것을 환영합니다!</p>
      
      <div className="flex gap-3">
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