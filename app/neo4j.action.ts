"use server";
import { driver } from "@/db";
import { Neo4JUser } from "@/types";

export const getUserById = async (id: string) => {
  const result = await driver.executeQuery(
    `MATCH (u:User {applictionId: $applictionId}) RETURN u`,
    { applictionId: id }
  );
  const users = result.records.map((record) => record.get("u").properties);
  if (users.length === 0) return null;
  return users[0] as Neo4JUser;
};

export const createUser = async (user: Neo4JUser) => {
  const { applicationId, firstname, lastname, email } = user;
  await driver.executeQuery(
    `CREATE (u:User {applictionId :$applicationId, firstname : $firstname , lastname : $lastname , email : $email})`,
    { applicationId, firstname, lastname, email }
  );
};

export const getUserWithNOConnection = async (id: string) => {
  const result = await driver.executeQuery(
    ` 
   MATCH (cu:User {applictionId: $applictionId})
        MATCH (ou:User)
        WHERE NOT (cu)-[:LIKE|:DISLIKE]->(ou) AND cu <> ou
        RETURN ou

    `,
        {
            applictionId:id
        }
  );
  const users = result.records.map((record) => record.get("ou").properties);
  return users as Neo4JUser[];
};

export const deleteUser = async (id: string) => {
    try {
      const result = await driver.executeQuery(
        `
          MATCH (u:User {applictionId: $applictionId})
          DELETE u
          RETURN u
        `,
        {
            applictionId: id
        }
      );
  
      if (result.records.length === 0) {
        console.log(`No user found with applictionId: ${id}`);
        return null; // or throw an error or return a message indicating no user was found
      }
  
      const deletedUser = result.records[0].get('u').properties;
      console.log(deletedUser, 'Deleted user');
      return deletedUser as Neo4JUser;
    } catch (error) {
      console.error('Error executing delete query:', error);
      throw error;
    }
  };

export const neo4jSwipe = async (id:string , swipe:string , userId:string) => {
    try {
        const type = swipe === 'left' ? "DISLIKE" : "LIKE"
        await driver.executeQuery(
            `MATCH (cu:User {applictionId : $id}),(ou:User {applictionId:$userId}) CREATE (cu)-[:${type}]->(ou)`,
            {
                id,
                userId
            }
        )
        if(type == 'LIKE') {
            const result = await driver.executeQuery(
                `MATCH (cu:User {applictionId : $id}),(ou:User {applictionId:$userId}) WHERE  (ou)-[:LIKE]->(cu) RETURN ou as match`,
                {
                    id,
                    userId
                }
              );
              const matches = result.records.map((records) => records.get("match").properties)
              return Boolean(matches.length > 0)
    
        }
       
    }
    catch(err) {
        console.log(err,'the error')
    }


}

export const getmatches = async (id:string) => {
    try{
const result  = await driver.executeQuery(
    `MATCH (cu: User{applictionId :$id})-[:LIKE]-(ou:User)-[:LIKE]-> (cu) RETURN ou as match`,
    {
        id :id
    }
)
const matches = result.records.map((record) => record.get("match").properties)
return matches as Neo4JUser[]
    }catch(err) {
        console.log(err)
    }
}
