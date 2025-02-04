import AllExpenseTable from '@/components/AllExpenseTable'
import React from 'react'

const ExpensePage = () => {
  return (
    <div className='flex flex-col space-y-8'>
      <h2 className='h2 text-brand'>All expenses for current vehicle</h2>
      <AllExpenseTable />
    </div>
  )
}

export default ExpensePage