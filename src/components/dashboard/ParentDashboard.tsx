import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, FileText, Calendar, MessageCircle, TrendingUp, User, Target } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import DashboardHeader from './DashboardHeader'

const ParentDashboard = () => {
  const { profile } = useAuth()

  const childInfo = {
    name: 'Alice Johnson',
    class: 'Grade 10-A',
    rollNumber: 'G10A-025',
    gpa: '3.72'
  }

  const stats = [
    { title: 'Current GPA', value: childInfo.gpa, icon: TrendingUp, color: 'text-success' },
    { title: 'Attendance', value: '92%', icon: Calendar, color: 'text-info' },
    { title: 'Assignments', value: '8', icon: FileText, color: 'text-warning' },
    { title: 'Messages', value: '2', icon: MessageCircle, color: 'text-accent' }
  ]

  const recentGrades = [
    { subject: 'Mathematics', grade: 'A-', percentage: '90%' },
    { subject: 'English', grade: 'B+', percentage: '85%' },
    { subject: 'Science', grade: 'A', percentage: '94%' },
    { subject: 'History', grade: 'B', percentage: '82%' }
  ]

  const upcomingEvents = [
    { title: 'Parent-Teacher Meeting', date: 'Oct 30', time: '3:00 PM' },
    { title: 'Science Fair', date: 'Nov 5', time: '10:00 AM' },
    { title: 'Monthly Assessment', date: 'Nov 15', time: '9:00 AM' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <DashboardHeader userRole="parent" userName={profile?.name || 'Parent'} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {profile?.name}!</h1>
          <p className="text-muted-foreground">Track {childInfo.name}'s academic progress and stay connected.</p>
        </div>

        {/* Child Info Card */}
        <Card className="mb-8 bg-gradient-to-r from-warning/10 to-warning/5 border-warning/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-warning" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{childInfo.name}</h2>
                <p className="text-muted-foreground">{childInfo.class} • Roll No: {childInfo.rollNumber}</p>
              </div>
            </div>
          </CardContent>
        </Card>

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
                <Target className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="parent" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                View Assignments
              </Button>
              <Button variant="parent" className="w-full justify-start">
                <BookOpen className="mr-2 h-4 w-4" />
                Check Grades
              </Button>
              <Button variant="parent" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                View Attendance
              </Button>
              <Button variant="parent" className="w-full justify-start">
                <MessageCircle className="mr-2 h-4 w-4" />
                Contact Teacher
              </Button>
            </CardContent>
          </Card>

          {/* Recent Grades */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Recent Grades</CardTitle>
              <CardDescription>{childInfo.name}'s latest results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentGrades.map((grade, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{grade.subject}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default" className="bg-success text-success-foreground">
                        {grade.grade}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{grade.percentage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Important dates and meetings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg">
                    <h3 className="font-semibold">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">{event.date} at {event.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ParentDashboard