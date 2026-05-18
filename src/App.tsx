import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/Sidebar'
import { CommandPalette } from '@/components/CommandPalette'
import { ShortcutsModal } from '@/components/ShortcutsModal'
import s from './App.module.css'

export default function App() {
  return (
    <div className={s.layout}>
      <Sidebar />
      <main className={s.main}>
        <Outlet />
      </main>
      <CommandPalette />
      <ShortcutsModal />
    </div>
  )
}
