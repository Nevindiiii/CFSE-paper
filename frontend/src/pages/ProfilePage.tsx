import { useEffect, useState } from 'react'
import { User, Mail, Calendar, Shield, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getProfileApi, type UserProfile } from '@/services/authService'

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getProfileApi()
      .then(({ data }) => setProfile(data))
      .catch(() => setError('Failed to load profile.'))
      .finally(() => setLoading(false))
  }, [])

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-semibold">Profile</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Your account information</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin text-muted-foreground" />
        </div>
      )}

      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {profile && (
        <>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <span className="text-2xl font-bold text-white">
                    {profile.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{profile.name}</h3>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 py-3 border-b">
                <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center">
                  <User size={15} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Full Name</p>
                  <p className="text-sm font-medium">{profile.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 py-3 border-b">
                <div className="w-8 h-8 rounded-md bg-purple-50 flex items-center justify-center">
                  <Mail size={15} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email Address</p>
                  <p className="text-sm font-medium">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 py-3 border-b">
                <div className="w-8 h-8 rounded-md bg-green-50 flex items-center justify-center">
                  <Shield size={15} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Account ID</p>
                  <p className="text-sm font-medium font-mono text-xs">{profile._id}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 py-3">
                <div className="w-8 h-8 rounded-md bg-orange-50 flex items-center justify-center">
                  <Calendar size={15} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Member Since</p>
                  <p className="text-sm font-medium">{formatDate(profile.createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
