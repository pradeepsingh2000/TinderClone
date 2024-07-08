import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation';
import { getUserById, getUserWithNOConnection } from './neo4j.action';
import Homepage from './components/Home';
export default async function Home() {
  const { isAuthenticated, getUser } = getKindeServerSession()

  if (! await isAuthenticated()) {
    return redirect('/api/auth/login?post_login_redirect_url=http://localhost:3000/callback')
  }
  const user = await getUser()
  if (!user) {
    return redirect('/api/auth/login?post_login_redirect_url=http://localhost:3000/callback')

  }

  const userWithNoConnection = await getUserWithNOConnection(user.id)
  const currentUser = await getUserById(user.id)

  return (
    <main>

    <div>
      {currentUser && <Homepage currentUser={currentUser} user={userWithNoConnection} />
      }
    </div>
    </main>
  );
}
