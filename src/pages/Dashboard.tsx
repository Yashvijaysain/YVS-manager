import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Loader2 } from 'lucide-react'
import AdminDashboard from '@/components/dashboard/AdminDashboard'
import TeacherDashboard from '@/components/dashboard/TeacherDashboard'
import StudentDashboard from '@/components/dashboard/StudentDashboard'
import ParentDashboard from '@/components/dashboard/ParentDashboard'

const Dashboard = () => {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-accent/10">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return <Navigate to="/auth" replace />
  }

  const getDashboardByRole = () => {
    switch (profile.role) {
      case 'admin':
        return <AdminDashboard />
      case 'teacher':
        return <TeacherDashboard />
      case 'student':
        return <StudentDashboard />
      case 'parent':
        return <ParentDashboard />
      default:
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-destructive mb-2">Invalid Role</h1>
              <p className="text-muted-foreground">Your account role is not recognized.</p>
            </div>
          </div>
        )
    }
  }

  return getDashboardByRole()
}

export default Dashboard