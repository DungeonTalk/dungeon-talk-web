import { Outlet } from 'react-router'

export default function RootLayout() {
  return (
    <div className="min-h-dvh bg-slate-900">
      <Outlet />
    </div>
  )
}