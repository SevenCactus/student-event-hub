export type GuideCategory = 'balance' | 'career'

export type RoadmapMilestone = {
  semester: string
  focus: string
  detail: string
}

export type RelatedToolTarget = 'time_budget' | 'activity_decision' | 'portfolio'

export type GuideCardItem = {
  id: string
  icon: string
  title: string
  text: string
  color: 'orange' | 'purple' | 'green' | 'red' | 'blue' | 'cyan'
  tag: string
  category: GuideCategory
  // For backwards compatibility / industry skill cards
  tips?: string[]
  // Specific 4-part structure for 6 research-based balance cards (A3)
  statHighlight?: string
  realProblem?: string
  seniorPerspective?: {
    role: string // e.g. "S1 (Sinh viên năm 3)" or "R1 (Nhà tuyển dụng công nghệ)"
    quote: string
  }
  weeklyActions?: string[]
  roadmapMilestones?: RoadmapMilestone[]
  relatedTool?: {
    type: RelatedToolTarget
    label: string
    description: string
  }
}

