import AllUsersTable from '@/components/AllUsersTable';
import { Button } from '@/components/ui/button';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import React from 'react'

const UsersPage = () => {
  return (
    <div className="w-full flex-col space-y-8">
      <div className="flex justify-between">
        <p className="h2 text-brand text-2xl font-semibold">
          Manage users' permission
        </p>
        <Button
          className="rounded-full"
        >
          <PlusCircledIcon className="text-xl font-semibold" />
          Invite User
        </Button>
      </div>

      <AllUsersTable />
    </div>
  )
}

export default UsersPage
