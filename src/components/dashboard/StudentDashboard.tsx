import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, FileText, Clock, TrendingUp, Calendar, MessageCircle, Target } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import DashboardHeader from './DashboardHeader'

const StudentDashboard = () => {
  const { profile } = useAuth()

  const stats = [
    { title: 'Current GPA', value: '3.85', icon: TrendingUp, color: 'text-success' },
    { title: 'Assignments Due', value: '5', icon: FileText, color: 'text-warning' },
    { title: 'Attendance', value: '94%', icon: Calendar, color: 'text-info' },
    { title: 'Messages', value: '3', icon: MessageCircle, color: 'text-accent' }
  ]

  const upcomingAssignments = [
    { subject: 'Mathematics', title: 'Algebra Problem Set', dueDate: 'Tomorrow', status: 'pending' },
    { subject: 'English', title: 'Essay on Shakespeare', dueDate: 'Oct 28', status: 'in-progress' },
    { subject: 'Science', title: 'Lab Report', dueDate: 'Oct 30', status: 'not-started' },
    { subject: 'History', title: 'World War II Analysis', dueDate: 'Nov 2', status: 'not-started' }
  ]

  const recentGrades = [
    { subject: 'Mathematics', assignment: 'Quiz 3', grade: 'A-', percentage: '92%' },
    { subject: 'English', assignment: 'Essay 2', grade: 'B+', percentage: '87%' },
    { subject: 'Science', assignment: 'Lab 4', grade: 'A', percentage: '95%' },
    { subject: 'History', assignment: 'Test 2', grade: 'B', percentage: '83%' }
  ]

  const todaySchedule = [
    { subject: 'Mathematics', time: '9:00 AM', room: 'Room 101', teacher: 'Mr. Johnson' },
    { subject: 'English', time: '11:00 AM', room: 'Room 205', teacher: 'Ms. Davis' },
    { subject: 'Science', time: '2:00 PM', room: 'Lab 3', teacher: 'Dr. Smith' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning text-warning-foreground'
      case 'in-progress': return 'bg-info text-info-foreground'
      case 'not-started': return 'bg-muted text-muted-foreground'
      default: return 'bg-secondary text-secondary-foreground'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <DashboardHeader userRole="student" userName={profile?.name || 'Student'} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {profile?.name}!</h1>
          <p className="text-muted-foreground">Track your academic progress and stay organized.</p>
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
                <Target className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="student" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Submit Assignment
              </Button>
              <Button variant="student" className="w-full justify-start">
                <BookOpen className="mr-2 h-4 w-4" />
                View Grades
              </Button>
              <Button variant="student" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Check Attendance
              </Button>
              <Button variant="student" className="w-full justify-start">
                <MessageCircle className="mr-2 h-4 w-4" />
                Message Teacher
              </Button>
            </CardContent>
          </Card>

          {/* Today's Schedule */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today's Classes
              </CardTitle>
              <CardDescription>Your schedule for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todaySchedule.map((class_, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-info" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{class_.subject}</h3>
                        <p className="text-sm text-muted-foreground">{class_.teacher}</p>
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

          {/* Upcoming Assignments */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Upcoming Assignments
              </CardTitle>
              <CardDescription>Assignments due soon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAssignments.map((assignment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{assignment.title}</h3>
                      <p className="text-sm text-muted-foreground">{assignment.subject}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="text-sm font-medium">Due: {assignment.dueDate}</p>
                        <Badge className={getStatusColor(assignment.status)}>
                          {assignment.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Grades */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Recent Grades</CardTitle>
              <CardDescription>Your latest results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentGrades.map((grade, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{grade.subject}</p>
                      <p className="text-xs text-muted-foreground">{grade.assignment}</p>
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
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard