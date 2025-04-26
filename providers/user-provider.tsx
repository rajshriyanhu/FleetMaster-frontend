'use client';

import UserContext from '@/context/user-context'
import { User } from '@/dto';
import { useGetLoggedInUser } from '@/hooks/use-auth-hook';
import React, { useEffect, useState } from 'react'

const UserProvider = ({children} : {
    children : React.ReactNode
}) => {
    const [user, setUser] = useState<User | undefined>(undefined);
    const {data} = useGetLoggedInUser();
    useEffect(() => {
        if(!data)return;
        setUser(data)
    },[data])

  return (
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
