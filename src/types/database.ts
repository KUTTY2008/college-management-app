export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          role: 'student' | 'staff'
          roll_number: string | null
          phone: string | null
          batch: string | null
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          role?: 'student' | 'staff'
          roll_number?: string | null
          phone?: string | null
          batch?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          role?: 'student' | 'staff'
          roll_number?: string | null
          phone?: string | null
          batch?: string | null
          created_at?: string
        }
      }
      files: {
        Row: {
          id: string
          user_id: string
          name: string
          url: string
          size: number
          type: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          url: string
          size: number
          type: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          url?: string
          size?: number
          type?: string
          created_at?: string
        }
      }
    }
  }
}
