'use client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Neo4JUser } from '@/types'
import React from 'react'
import TinderCard from 'react-tinder-card'
import { neo4jSwipe } from '../neo4j.action'
interface HomepageProps {
    currentUser: Neo4JUser,
    user: Neo4JUser[]
}

const Homepage: React.FC<HomepageProps> = ({
    currentUser,
    user
}) => {

    const handleDirection =async (direction:string , userId: string) => {
const isMatch = await neo4jSwipe(currentUser.applictionId , direction,userId)
        if(isMatch) alert("Congrates its a match")
    }
    return (

        <div className='w-screen h-screen flex justify-center items-center'>
            <div>
         
            <div>
                <h1 className='text-4xl'>Hello {currentUser.firstname} {currentUser.lastname}</h1>
            </div>
            <div className='mt-4 relative'>

            {
                user.map((user) => (
                    <TinderCard key={user.applictionId} onSwipe={(direction) => handleDirection(direction, user.applictionId)} className='absolute'>
                        <Card>
                            <CardHeader>
                                <CardTitle>{user.firstname} {user.lastname}</CardTitle>
                                <CardDescription>{user.email}</CardDescription>
                            </CardHeader>
                            
                        </Card>

                    </TinderCard>
                ))
            }
            </div>
                   
                   </div>
        </div>
    )
}

export default Homepage
