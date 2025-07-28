import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Users, FileText, MessageCircle, Calendar, Plus } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import DashboardHeader from './DashboardHeader'

const TeacherDashboard = () => {
  const { profile } = useAuth()

  const stats = [
    { title: 'My Classes', value: '6', icon: Users, color: 'text-primary' },
    { title: 'Total Students', value: '180', icon: BookOpen, color: 'text-info' },
    { title: 'Assignments', value: '24', icon: FileText, color: 'text-accent' },
    { title: 'Messages', value: '12', icon: MessageCircle, color: 'text-warning' }
  ]

  const recentActivities = [
    { title: 'Grade 10-A submitted Math Assignment', time: '2 hours ago', type: 'assignment' },
    { title: 'Parent meeting scheduled for tomorrow', time: '4 hours ago', type: 'meeting' },
    { title: 'New message from John Smith', time: '6 hours ago', type: 'message' },
    { title: 'Grade 9-B attendance marked', time: '1 day ago', type: 'attendance' }
  ]

  const upcomingClasses = [
    { subject: 'Mathematics', class: 'Grade 10-A', time: '9:00 AM', room: 'Room 101' },
    { subject: 'Algebra', class: 'Grade 9-B', time: '11:00 AM', room: 'Room 203' },
    { subject: 'Geometry', class: 'Grade 11-C', time: '2:00 PM', room: 'Room 105' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <DashboardHeader userRole="teacher" userName={profile?.name || 'Teacher'} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {profile?.name}!</h1>
          <p className="text-muted-foreground">Manage your classes and connect with students.</p>
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="teacher" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Create Assignment
              </Button>
              <Button variant="teacher" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Take Attendance
              </Button>
              <Button variant="teacher" className="w-full justify-start">
                <BookOpen className="mr-2 h-4 w-4" />
                Upload Results
              </Button>
              <Button variant="teacher" className="w-full justify-start">
                <MessageCircle className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </CardContent>
          </Card>

          {/* Today's Schedule */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today's Schedule
              </CardTitle>
              <CardDescription>Your upcoming classes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingClasses.map((class_, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{class_.subject}</h3>
                        <p className="text-sm text-muted-foreground">{class_.class}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{class_.time}</p>
                      <p className="text-sm text-muted-foreground">{class_.room}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your classes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                    <Badge variant="secondary">{activity.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Overview */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Class Performance</CardTitle>
              <CardDescription>Average grades overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Grade 10-A</span>
                  <Badge variant="default" className="bg-success text-success-foreground">85%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Grade 9-B</span>
                  <Badge variant="default" className="bg-warning text-warning-foreground">78%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Grade 11-C</span>
                  <Badge variant="default" className="bg-success text-success-foreground">92%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Average</span>
                  <Badge variant="default">85%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default TeacherDashboard