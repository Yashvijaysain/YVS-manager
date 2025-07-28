import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Users, GraduationCap, BookOpen, Heart, Plus, Settings, BarChart3, Eye } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import DashboardHeader from './DashboardHeader'
import { AddTeacherForm } from '@/components/forms/AddTeacherForm'
import { AddStudentForm } from '@/components/forms/AddStudentForm'
import { AddParentForm } from '@/components/forms/AddParentForm'
import { toast } from 'sonner'

const AdminDashboard = () => {
  const { profile } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState([
    { title: 'Total Teachers', value: '0', icon: BookOpen, color: 'text-accent' },
    { title: 'Total Students', value: '0', icon: GraduationCap, color: 'text-info' },
    { title: 'Total Parents', value: '0', icon: Heart, color: 'text-warning' },
    { title: 'Active Classes', value: '0', icon: Users, color: 'text-primary' }
  ])
  const [recentRegistrations, setRecentRegistrations] = useState<any[]>([])
  const [isTeacherDialogOpen, setIsTeacherDialogOpen] = useState(false)
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false)
  const [isParentDialogOpen, setIsParentDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false)

  const quickActions = [
    { 
      title: 'Add New Teacher', 
      description: 'Register a new teacher account', 
      icon: Plus, 
      variant: 'teacher' as const,
      onClick: () => setIsTeacherDialogOpen(true)
    },
    { 
      title: 'Add New Student', 
      description: 'Register a new student account', 
      icon: Plus, 
      variant: 'student' as const,
      onClick: () => setIsStudentDialogOpen(true)
    },
    { 
      title: 'Add New Parent', 
      description: 'Register a new parent account', 
      icon: Plus, 
      variant: 'parent' as const,
      onClick: () => setIsParentDialogOpen(true)
    },
    { 
      title: 'System Settings', 
      description: 'Configure system preferences', 
      icon: Settings, 
      variant: 'outline' as const,
      onClick: () => toast.info('System settings coming soon!')
    }
  ]

  useEffect(() => {
    fetchDashboardStats()
    fetchRecentRegistrations()
    
    // Set up real-time subscriptions
    const channel = supabase
      .channel('admin-dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchDashboardStats()
        fetchRecentRegistrations()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'teachers' }, () => {
        fetchDashboardStats()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, () => {
        fetchDashboardStats()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'parents' }, () => {
        fetchDashboardStats()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_dashboard_stats')
      if (error) throw error
      
      if (data && data.length > 0) {
        const statsData = data[0]
        setStats([
          { title: 'Total Teachers', value: statsData.total_teachers.toString(), icon: BookOpen, color: 'text-accent' },
          { title: 'Total Students', value: statsData.total_students.toString(), icon: GraduationCap, color: 'text-info' },
          { title: 'Total Parents', value: statsData.total_parents.toString(), icon: Heart, color: 'text-warning' },
          { title: 'Active Classes', value: statsData.active_classes.toString(), icon: Users, color: 'text-primary' }
        ])
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    }
  }

  const fetchRecentRegistrations = async () => {
    try {
      const { data, error } = await supabase.rpc('get_recent_registrations')
      if (error) throw error
      setRecentRegistrations(data || [])
    } catch (error) {
      console.error('Error fetching recent registrations:', error)
    }
  }

  const handleFormSuccess = () => {
    fetchDashboardStats()
    fetchRecentRegistrations()
    setIsTeacherDialogOpen(false)
    setIsStudentDialogOpen(false)
    setIsParentDialogOpen(false)
  }

  const fetchUserDetails = async (profileId: string, role: string) => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .maybeSingle()

      if (profileError) throw profileError
      if (!profile) {
        toast.error('User profile not found')
        return
      }

      let roleData = null
      if (role === 'teacher') {
        const { data, error } = await supabase
          .from('teachers')
          .select('*')
          .eq('profile_id', profileId)
          .maybeSingle()
        if (!error && data) roleData = data
      } else if (role === 'student') {
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .eq('profile_id', profileId)
          .maybeSingle()
        if (!error && data) roleData = data
      } else if (role === 'parent') {
        const { data, error } = await supabase
          .from('parents')
          .select('*')
          .eq('profile_id', profileId)
          .maybeSingle()
        if (!error && data) roleData = data
      }

      setSelectedUser({ ...profile, roleData })
      setIsUserDetailsOpen(true)
    } catch (error) {
      console.error('Error fetching user details:', error)
      toast.error('Failed to fetch user details')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <DashboardHeader userRole="admin" userName={profile?.name || 'Admin'} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {profile?.name}!</h1>
          <p className="text-muted-foreground">Manage your school's operations from your admin dashboard.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow duration-200 cursor-pointer border-2 hover:border-primary/20">
                  <CardContent className="p-4 text-center">
                    <action.icon className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                    <h3 className="font-semibold mb-2">{action.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
                    <Button variant={action.variant} size="sm" className="w-full" onClick={action.onClick}>
                      {action.title}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Registrations</CardTitle>
              <CardDescription>Latest user registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentRegistrations.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No recent registrations</p>
                ) : (
                  recentRegistrations.map((item, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 cursor-pointer transition-colors duration-200"
                      onClick={() => fetchUserDetails(item.profile_id, item.role)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.role === 'teacher' 
                              ? item.department 
                              : item.role === 'student' 
                                ? item.class_name 
                                : item.relation}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <Badge variant="secondary">{item.role}</Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(item.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
              <CardDescription>Current system status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">Active Sessions</span>
                  <Badge variant="default">342</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">Pending Approvals</span>
                  <Badge variant="destructive">12</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">System Health</span>
                  <Badge variant="default" className="bg-success text-success-foreground">Excellent</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">Database Size</span>
                  <Badge variant="secondary">2.4 GB</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add User Dialogs */}
        <Dialog open={isTeacherDialogOpen} onOpenChange={setIsTeacherDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <AddTeacherForm 
              onSuccess={handleFormSuccess}
              onCancel={() => setIsTeacherDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={isStudentDialogOpen} onOpenChange={setIsStudentDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <AddStudentForm 
              onSuccess={handleFormSuccess}
              onCancel={() => setIsStudentDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={isParentDialogOpen} onOpenChange={setIsParentDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <AddParentForm 
              onSuccess={handleFormSuccess}
              onCancel={() => setIsParentDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* User Details Dialog */}
        <Dialog open={isUserDetailsOpen} onOpenChange={setIsUserDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  {selectedUser.photo_url && (
                    <img 
                      src={selectedUser.photo_url} 
                      alt={selectedUser.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                    <Badge variant="secondary" className="mt-1">{selectedUser.role}</Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-sm">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Contact</label>
                    <p className="text-sm">{selectedUser.contact_number}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                    <p className="text-sm">{new Date(selectedUser.date_of_birth).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Registered</label>
                    <p className="text-sm">{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                {selectedUser.roleData && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Role-specific Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedUser.role === 'teacher' && (
                        <>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Employee ID</label>
                            <p className="text-sm">{selectedUser.roleData.employee_id || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Department</label>
                            <p className="text-sm">{selectedUser.roleData.department || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Class Assigned</label>
                            <p className="text-sm">{selectedUser.roleData.class_assigned || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Experience</label>
                            <p className="text-sm">{selectedUser.roleData.experience_years || 0} years</p>
                          </div>
                          <div className="col-span-2">
                            <label className="text-sm font-medium text-muted-foreground">Subjects</label>
                            <p className="text-sm">{selectedUser.roleData.subjects?.join(', ') || 'N/A'}</p>
                          </div>
                        </>
                      )}
                      
                      {selectedUser.role === 'student' && (
                        <>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Student ID</label>
                            <p className="text-sm">{selectedUser.roleData.student_id || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Class</label>
                            <p className="text-sm">{selectedUser.roleData.class_name || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Roll Number</label>
                            <p className="text-sm">{selectedUser.roleData.roll_number || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Parent Name</label>
                            <p className="text-sm">{selectedUser.roleData.parent_name || 'N/A'}</p>
                          </div>
                        </>
                      )}
                      
                      {selectedUser.role === 'parent' && (
                        <>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Child Name</label>
                            <p className="text-sm">{selectedUser.roleData.child_name || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Relationship</label>
                            <p className="text-sm">{selectedUser.roleData.relationship || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Occupation</label>
                            <p className="text-sm">{selectedUser.roleData.occupation || 'N/A'}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default AdminDashboard