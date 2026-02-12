export interface StudentUser {
  id: string; // Supabase auth user id
  name: string;
  phone: string;
  prn: string;
  email: string;
  uid: string; // Unique student ID printed on pages
  created_at?: string;
}
