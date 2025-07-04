export interface User {
  id: string;
  email: string;
  role: 'student' | 'employer' | 'admin';
  profile?: StudentProfile | EmployerProfile | AdminProfile;
}

export interface StudentProfile {
  id: string;
  username: string;
  full_name: string;
  bio: string;
  avatar_url?: string;
  major?: string;
  graduation_year?: number;
  gpa?: number;
  skills?: string[];
  resume_url?: string;
  created_at: string;
  updated_at: string;
}

export interface EmployerProfile {
  id: string;
  username: string;
  full_name: string;
  bio: string;
  avatar_url?: string;
  website?: string;
  company_name?: string;
  industry?: string;
  company_size?: string;
  contact_title?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminProfile {
  id: string;
  username: string;
  full_name: string;
  bio: string;
  avatar_url?: string;
  department?: string;
  position?: string;
  permissions?: string[];
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  type: 'internship' | 'full-time' | 'part-time';
  location: string;
  salary?: string;
  description: string;
  requirements: string[];
  skills: string[];
  posted_date: string;
  deadline?: string;
  applicants_count?: number;
  employer_id: string;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  job_id: string;
  student_id: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  applied_date: string;
  cover_letter?: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  from_id: string;
  to_id: string;
  content: string;
  timestamp: string;
  read: boolean;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  type: 'career_fair' | 'workshop' | 'info_session' | 'webinar' | 'networking';
  location: string;
  virtual_link?: string;
  start_date: string;
  end_date: string;
  capacity?: number;
  registered_count: number;
  organizer_id: string;
  organizer_type: 'admin' | 'employer';
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  requirements?: string[];
  tags?: string[];
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  student_id: string;
  registered_date: string;
  attendance_status: 'registered' | 'attended' | 'no_show';
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'application_update' | 'event_reminder' | 'message' | 'announcement' | 'deadline';
  title: string;
  message: string;
  read: boolean;
  action_url?: string;
  created_at: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'template' | 'guide' | 'faq';
  category: 'resume' | 'interview' | 'career_planning' | 'networking' | 'general';
  content?: string;
  file_url?: string;
  author_id: string;
  published: boolean;
  tags?: string[];
  created_at: string;
  updated_at: string;
}