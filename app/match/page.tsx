import { redirect } from "next/navigation"
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { getmatches } from "../neo4j.action"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function Matches () {
    const { isAuthenticated, getUser } = getKindeServerSession()

    if (! await isAuthenticated()) {
      return redirect('/api/auth/login?post_login_redirect_url=http://localhost:3000/callback')
    }
    const user = await getUser()
    if (!user) {
      return redirect('/api/auth/login?post_login_redirect_url=http://localhost:3000/callback')
  
    }
    const matches = await getmatches(user.id)
    return (
        <main>
            {
                matches?.map((user) => (
                    <Card>
                            <CardHeader>
                                <CardTitle>{user.firstname} {user.lastname}</CardTitle>
                                <CardDescription>{user.email}</CardDescription>
                            </CardHeader>
                            
                        </Card>
                ))
            }
        </main>
    )
}