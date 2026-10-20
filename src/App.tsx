import { Canvas, useFrame } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Filter,
  Plus,
  Search,
  Sparkles,
  Star,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

const STORAGE_KEY = 'langit-calendar-tasks-v1'

export type TaskPriority = 'High' | 'Medium' | 'Low'
export type TaskCategory = 'Work' | 'Personal' | 'Study' | 'Health' | 'Meeting'
export type TaskStatus = 'Pending' | 'Completed'

export type Task = {
  id: string
  title: string
  date: string
  start: string
  end: string
  priority: TaskPriority
  category: TaskCategory
  done: boolean
  notes?: string
}

type ViewMode = 'grid' | 'isometric' | 'orbit'

const DEFAULT_TASKS: Task[] = [
  {
    id: '1',
    title: 'Design sprint review',
    date: formatKey(new Date(new Date().getFullYear(), new Date().getMonth(), 3)),
    start: '09:00',
    end: '10:30',
    priority: 'High',
    category: 'Work',
    done: false,
    notes: 'Review desktop and tablet mockups',
  },
  {
    id: '2',
    title: 'Deep work block',
    date: formatKey(new Date(new Date().getFullYear(), new Date().getMonth(), 6)),
    start: '13:30',
    end: '15:00',
    priority: 'Medium',
    category: 'Study',
    done: true,
    notes: 'Finish the interaction prototype',
  },
  {
    id: '3',
    title: 'Gym recovery',
    date: formatKey(new Date(new Date().getFullYear(), new Date().getMonth(), 10)),
    start: '18:30',
    end: '19:30',
    priority: 'Low',
    category: 'Health',
    done: false,
    notes: 'Stretching and mobility session',
  },
  {
    id: '4',
    title: 'Client sync',
    date: formatKey(new Date(new Date().getFullYear(), new Date().getMonth(), 14)),
    start: '16:00',
    end: '17:00',
    priority: 'High',
    category: 'Meeting',
    done: false,
    notes: 'Project launch follow-up',
  },
  {
    id: '5',
    title: 'Study AI notes',
    date: formatKey(new Date(new Date().getFullYear(), new Date().getMonth(), 18)),
    start: '19:00',
    end: '20:00',
    priority: 'Medium',
    category: 'Study',
    done: false,
    notes: 'Revise recent AI concepts',
  },
]

function formatKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseKey(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function getMonthGrid(month: Date) {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1)
  const startDate = new Date(firstDay)
  const offset = (firstDay.getDay() + 6) % 7
  startDate.setDate(firstDay.getDate() - offset)

  return Array.from({ length: 42 }, (_, index) => {
    const d = new Date(startDate)
    d.setDate(startDate.getDate() + index)
    return d
  })
}

function addTaskDefaults() {
  const today = new Date()
  return {
    title: '',
    date: formatKey(today),
    start: '09:00',
    end: '10:00',
    priority: 'Medium' as TaskPriority,
    category: 'Study' as TaskCategory,
    notes: '',
  }
}

function App() {
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [selectedDate, setSelectedDate] = useState(() => formatKey(new Date()))
  const [view, setView] = useState<ViewMode>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | TaskStatus>('All')
  const [priorityFilter, setPriorityFilter] = useState<'All' | TaskPriority>('All')
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return DEFAULT_TASKS

    try {
      const parsed = JSON.parse(saved) as Task[]
      return parsed.length ? parsed : DEFAULT_TASKS
    } catch {
      return DEFAULT_TASKS
    }
  })
  const [draft, setDraft] = useState(addTaskDefaults)
  const [isComposerOpen, setIsComposerOpen] = useState(false)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const monthDates = useMemo(() => getMonthGrid(month), [month])

  const selectedDateObj = useMemo(() => parseKey(selectedDate), [selectedDate])

  const dayTasks = useMemo(
    () =>
      tasks.filter((task) => task.date === selectedDate).filter((task) => {
        const query = searchTerm.trim().toLowerCase()
        const matchesText = !query || task.title.toLowerCase().includes(query) || task.notes?.toLowerCase().includes(query)
        const matchesStatus = statusFilter === 'All' || (statusFilter === 'Completed' ? task.done : !task.done)
        const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter

        return matchesText && matchesStatus && matchesPriority
      }),
    [tasks, selectedDate, searchTerm, statusFilter, priorityFilter],
  )

  const todayKey = formatKey(new Date())

  const addTask = () => {
    if (!draft.title.trim()) return

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: draft.title.trim(),
      date: draft.date,
      start: draft.start,
      end: draft.end,
      priority: draft.priority,
      category: draft.category,
      notes: draft.notes?.trim() || '',
      done: false,
    }

    setTasks((prev) => [...prev, newTask])
    setDraft(addTaskDefaults())
    setSelectedDate(draft.date)
    setIsComposerOpen(false)
  }

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, done: !task.done } : task)),
    )
  }

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  const monthLabel = month.toLocaleString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="min-h-screen bg-[#050c16] text-slate-100">
      <div className="mx-auto max-w-[1500px] px-4 py-4 lg:px-6">
        <div className="glass-panel overflow-hidden rounded-[30px] border border-white/10">
          <div className="flex min-h-[900px] flex-col xl:flex-row">
            <aside className="w-full border-b border-white/10 bg-slate-950/70 px-4 py-5 xl:w-[330px] xl:border-b-0 xl:border-r">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-violet-600 shadow-lg shadow-cyan-500/30">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Workspace</p>
                  <h1 className="text-2xl font-bold tracking-tight">3D Calendar</h1>
                </div>
              </div>

              <div className="glass-panel mb-5 rounded-2xl p-3">
                <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.22em] text-slate-400">
                  <span>Summary</span>
                  <Sparkles className="h-4 w-4 text-cyan-300" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-xl bg-slate-900/80 px-3 py-2">
                    <span className="text-slate-300">Tasks</span>
                    <strong className="text-lg text-cyan-300">{tasks.length}</strong>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-900/80 px-3 py-2">
                    <span className="text-slate-300">Completed</span>
                    <strong className="text-lg text-emerald-300">{tasks.filter((task) => task.done).length}</strong>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-900/80 px-3 py-2">
                    <span className="text-slate-300">Focus</span>
                    <strong className="text-lg text-violet-300">{tasks.filter((task) => task.priority === 'High').length}</strong>
                  </div>
                </div>
              </div>

              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Tasks</h2>
                <button
                  className="rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-2.5 py-1.5 text-xs font-medium text-cyan-200"
                  onClick={() => setIsComposerOpen((value) => !value)}
                >
                  <span className="inline-flex items-center gap-1"><Plus className="h-3.5 w-3.5" /> New</span>
                </button>
              </div>

              {isComposerOpen && (
                <div className="glass-panel mb-4 rounded-2xl p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-200">Quick add</h3>
                    <button className="rounded-lg p-1 text-slate-300 hover:bg-white/5" onClick={() => setIsComposerOpen(false)}>
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    <input
                      value={draft.title}
                      onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
                      placeholder="Task title"
                      className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none ring-0 transition focus:border-cyan-400/60"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={draft.date}
                        onChange={(event) => setDraft((prev) => ({ ...prev, date: event.target.value }))}
                        className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400/60"
                      />
                      <select
                        value={draft.category}
                        onChange={(event) => setDraft((prev) => ({ ...prev, category: event.target.value as TaskCategory }))}
                        className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400/60"
                      >
                        <option>Work</option>
                        <option>Personal</option>
                        <option>Study</option>
                        <option>Health</option>
                        <option>Meeting</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="time"
                        value={draft.start}
                        onChange={(event) => setDraft((prev) => ({ ...prev, start: event.target.value }))}
                        className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400/60"
                      />
                      <input
                        type="time"
                        value={draft.end}
                        onChange={(event) => setDraft((prev) => ({ ...prev, end: event.target.value }))}
                        className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400/60"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={draft.priority}
                        onChange={(event) => setDraft((prev) => ({ ...prev, priority: event.target.value as TaskPriority }))}
                        className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400/60"
                      >
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                      </select>
                      <button
                        className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-3 py-2.5 text-sm font-medium text-white"
                        onClick={addTask}
                      >
                        Save task
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {tasks
                  .filter((task) => task.date === selectedDate)
                  .filter((task) => {
                    const term = searchTerm.trim().toLowerCase()
                    const matchesText = !term || task.title.toLowerCase().includes(term) || (task.notes || '').toLowerCase().includes(term)
                    const matchesStatus = statusFilter === 'All' || (statusFilter === 'Completed' ? task.done : !task.done)
                    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter
                    return matchesText && matchesStatus && matchesPriority
                  })
                  .map((task) => (
                    <div key={task.id} className="rounded-2xl border border-white/10 bg-slate-900/80 p-3">
                      <div className="mb-2 flex items-start gap-3">
                        <button
                          className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-md border ${task.done ? 'border-emerald-400 bg-emerald-400 text-slate-950' : 'border-slate-600 bg-transparent'}`}
                          onClick={() => toggleTask(task.id)}
                        >
                          {task.done && <Check className="h-3 w-3" />}
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className={`truncate font-medium ${task.done ? 'text-slate-400 line-through' : 'text-slate-100'}`}>
                              {task.title}
                            </p>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${priorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                            <Clock3 className="h-3.5 w-3.5" />
                            <span>
                              {task.start} - {task.end}
                            </span>
                          </div>
                        </div>

                        <button className="rounded-lg p-1 text-slate-400 hover:bg-white/5" onClick={() => deleteTask(task.id)}>
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-full bg-sky-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-300">
                          {task.category}
                        </span>
                        <span className="text-[11px] text-slate-400">{task.done ? 'Done' : 'Pending'}</span>
                      </div>
                    </div>
                  ))}

                {!tasks.some((task) => task.date === selectedDate) && (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/60 p-4 text-center text-sm text-slate-400">
                    No tasks for this date.
                  </div>
                )}
              </div>
            </aside>

            <section className="flex-1 bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.12),_transparent_45%),linear-gradient(180deg,#070d17_0%,#0b1320_100%)] p-4 lg:p-5">
              <div className="glass-panel mb-4 rounded-[26px] p-3 sm:p-4">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-slate-950/70 text-slate-200 hover:bg-white/5"
                      onClick={() => setMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-slate-950/70 text-slate-200 hover:bg-white/5"
                      onClick={() => setMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <div className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2.5">
                      <span className="text-lg font-semibold tracking-tight">{monthLabel}</span>
                    </div>
                    <button
                      className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-3 py-2.5 text-sm font-medium text-cyan-200"
                      onClick={() => {
                        const now = new Date()
                        setMonth(new Date(now.getFullYear(), now.getMonth(), 1))
                        setSelectedDate(formatKey(now))
                      }}
                    >
                      Today
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-slate-300">
                      <Search className="h-4 w-4" />
                      <input
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        className="w-32 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                        placeholder="Search"
                      />
                    </div>

                    <select
                      value={statusFilter}
                      onChange={(event) => setStatusFilter(event.target.value as 'All' | TaskStatus)}
                      className="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-slate-200 outline-none"
                    >
                      <option value="All">All status</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </select>

                    <select
                      value={priorityFilter}
                      onChange={(event) => setPriorityFilter(event.target.value as 'All' | TaskPriority)}
                      className="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-slate-200 outline-none"
                    >
                      <option value="All">All priority</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>

                    <div className="inline-flex rounded-xl border border-white/10 bg-slate-950/70 p-1">
                      {(['grid', 'isometric', 'orbit'] as ViewMode[]).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setView(mode)}
                          className={`rounded-lg px-3 py-2 text-xs font-medium uppercase tracking-[0.18em] ${
                            view === mode ? 'bg-gradient-to-r from-cyan-500 to-indigo-500 text-white' : 'text-slate-300'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-panel overflow-hidden rounded-[30px] border border-white/10">
                <div className="flex items-center justify-between border-b border-white/10 bg-slate-950/35 px-4 py-3 text-xs uppercase tracking-[0.25em] text-slate-400">
                  <span>3D planner</span>
                  <div className="flex items-center gap-2">
                    <Filter className="h-3.5 w-3.5" />
                    <span>Live scene</span>
                  </div>
                </div>

                <div className="canvas-shell relative h-[560px] w-full">
                  <Canvas camera={{ position: [0, 5.5, 11], fov: 38 }} shadows>
                    <color attach="background" args={['#09111a']} />
                    <fog attach="fog" args={['#09111a', 10, 28]} />
                    <ambientLight intensity={1.2} />
                    <directionalLight position={[8, 12, 6]} intensity={2.4} castShadow />
                    <pointLight position={[-8, 8, -8]} intensity={1.1} color="#67e8f9" />
                    <pointLight position={[7, 10, -5]} intensity={1.3} color="#8b5cf6" />

                    <CalendarScene
                      monthDates={monthDates}
                      selectedDate={selectedDate}
                      tasks={tasks}
                      month={month}
                      view={view}
                      onSelect={(date) => setSelectedDate(date)}
                    />

                    <OrbitControls
                      enablePan={false}
                      minDistance={8}
                      maxDistance={18}
                      minPolarAngle={Math.PI / 3.6}
                      maxPolarAngle={Math.PI / 2.1}
                    />
                  </Canvas>

                  <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-slate-300">
                    {view.toUpperCase()}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

function CalendarScene({
  monthDates,
  selectedDate,
  tasks,
  month,
  view,
  onSelect,
}: {
  monthDates: Date[]
  selectedDate: string
  tasks: Task[]
  month: Date
  view: ViewMode
  onSelect: (date: string) => void
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current) {
      if (view === 'grid') {
        groupRef.current.rotation.y = -0.6 + Math.sin(t * 0.35) * 0.08
      }
      if (view === 'isometric') {
        groupRef.current.rotation.y = -0.95 + Math.sin(t * 0.35) * 0.06
        groupRef.current.rotation.x = 0.32
      }
      if (view === 'orbit') {
        groupRef.current.rotation.y = -1.2 + t * 0.14
        groupRef.current.rotation.x = 0.12
      }
    }
  })

  const cellMap = useMemo(() => {
    const map = new Map<string, Task[]>()
    for (const task of tasks) {
      if (!map.has(task.date)) map.set(task.date, [])
      map.get(task.date)!.push(task)
    }
    return map
  }, [tasks])

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {monthDates.map((date, index) => {
        const key = formatKey(date)
        const isCurrentMonth = date.getMonth() === month.getMonth()
        const isSelected = key === selectedDate
        const tasksForDay = cellMap.get(key) || []
        const total = tasksForDay.length
        const isToday = key === formatKey(new Date())

        const x = (index % 7) - 3.1
        const y = 4.1 - Math.floor(index / 7) * 1.75
        const z = isSelected ? 0.7 : 0

        return (
          <group key={key} position={[x, y, z]}>
            <mesh
              castShadow
              receiveShadow
              position={[0, 0, 0]}
              onClick={(event) => {
                event.stopPropagation()
                onSelect(key)
              }}
            >
              <boxGeometry args={[1.4, 1.25, 0.7]} />
              <meshStandardMaterial
                color={
                  isSelected
                    ? '#6ee7f9'
                    : isToday
                      ? '#1d4ed8'
                      : isCurrentMonth
                        ? '#0f172a'
                        : '#111827'
                }
                emissive={isSelected ? '#0ea5e9' : '#020817'}
                emissiveIntensity={isSelected ? 0.8 : 0.18}
                metalness={0.8}
                roughness={0.25}
              />
            </mesh>

            <Html position={[0, 0.82, 0.38]} center distanceFactor={8}>
              <div className="rounded-full border border-white/10 bg-slate-950/75 px-2 py-0.8 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-200 shadow-lg">
                {date.getDate()}
              </div>
            </Html>

            {total > 0 && (
              <Html position={[0, -0.6, 0.42]} center distanceFactor={8}>
                <div className="rounded-full border border-cyan-400/30 bg-cyan-500/20 px-2 py-0.8 text-[9px] font-bold uppercase tracking-[0.1em] text-cyan-200">
                  {total} task{total > 1 ? 's' : ''}
                </div>
              </Html>
            )}
          </group>
        )
      })}
    </group>
  )
}

function priorityColor(priority: TaskPriority) {
  switch (priority) {
    case 'High':
      return 'bg-rose-500/15 text-rose-300'
    case 'Medium':
      return 'bg-amber-500/15 text-amber-300'
    default:
      return 'bg-emerald-500/15 text-emerald-300'
  }
}

export default App

