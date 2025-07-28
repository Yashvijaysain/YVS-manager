import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import { Loader2, GraduationCap, Users, BookOpen, Heart } from 'lucide-react';

const Auth = () => {
  const {
    user,
    loading,
    signIn
  } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Redirect if already authenticated
  if (user && !loading) {
    return <Navigate to="/dashboard" replace />;
  }
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningIn(true);
    const {
      error
    } = await signIn(formData.email, formData.password);
    if (error) {
      toast({
        title: 'Sign In Failed',
        description: error.message || 'Invalid credentials. Please try again.',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Welcome back!',
        description: 'You have been signed in successfully.'
      });
    }
    setIsSigningIn(false);
  };
  const handleAdminLogin = () => {
    setFormData({
      email: 'admin@school.edu',
      password: 'admin123'
    });
  };
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-accent/10">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>;
  }
return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-accent/10">
    <Card className="w-full max-w-md shadow-xl bg-card/95 backdrop-blur">
      <CardHeader className="text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-lg flex items-center justify-center p-2 bg-slate-950">
          <img src="/yvsimg/yvs.png" alt="YVS Logo" className="w-full h-full object-contain" />
        </div>
        <CardTitle className="text-2xl font-bold">YVS MANAGER</CardTitle>
        <CardDescription>
          Welcome Back!
        </CardDescription>
        <CardDescription>
          Sign in to access your school dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="login">Sign In</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" value={formData.email} onChange={e => setFormData({
                  ...formData,
                  email: e.target.value
                })} required className="transition-all duration-200 focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Enter your password" value={formData.password} onChange={e => setFormData({
                  ...formData,
                  password: e.target.value
                })} required className="transition-all duration-200 focus:ring-2 focus:ring-primary/20" />
              </div>
              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSigningIn}>
                {isSigningIn ? <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </> : 'Sign In'}
              </Button>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Lets Begin</span>
              </div>
            </div>
          
          </TabsContent>
        </Tabs>
        {/* Role Information */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-3 text-center">User Roles</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-destructive" />
              <span className="text-muted-foreground">Admin</span>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-accent" />
              <span className="text-muted-foreground">Teacher</span>
            </div>
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-4 w-4 text-info" />
              <span className="text-muted-foreground">Student</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-warning" />
              <span className="text-muted-foreground">Parent</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);
};
export default Auth;