export interface BoundaryOption {
  level: 'soft' | 'clear' | 'wall'
  emoji: '🟢' | '🟡' | '🔴'
  title: string
  useWhen: string
  script: string
  whyItWorks: string
}

export interface BoundaryResponse {
  quickTake: {
    validation: string
    insight: string
  }
  options: BoundaryOption[]
  visualMoodLighteners: {
    prompt: string
    imageUrl?: string
  }[]
}

export interface Generation {
  id: string
  userId: string
  userInput: string
  response: BoundaryResponse
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  email: string
  createdAt: string
}

export interface Database {
  public: {
    Tables: {
      generations: {
        Row: {
          id: string
          user_id: string
          user_input: string
          response: BoundaryResponse
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          user_input: string
          response: BoundaryResponse
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          user_input?: string
          response?: BoundaryResponse
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}