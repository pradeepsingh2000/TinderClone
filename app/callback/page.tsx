import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'
import { createUser, deleteUser, getUserById } from '../neo4j.action'
export default async function CallBack() {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user) {
        return redirect('/api/auth/login?post_login_redirect_url=http://localhost:3000/callback')
    }
    // await deleteUser(user.id)

    const dbUser = await getUserById(user.id)
    console.log(dbUser,'the dbUser')
    if(!dbUser) {
        await createUser({applicationId:user.id, firstname:user.given_name!, email:user.email!, lastname: user.family_name ?? " "})
        return redirect('/')
    }



}
