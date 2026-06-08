import React from 'react'
import { FaRegTrashAlt } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

function DropdownOption({children,handleOnDelete}) {

    const[openAlert,setOpenAlert]=React.useState(false);
    const onDeleteClick=()=>{   

    }
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white dark:bg-slate-900 border dark:border-slate-800 text-slate-900 dark:text-slate-100 p-1 rounded-lg shadow-md">
            <div className='flex items-center gap-1'>
          <DropdownMenuItem onClick={()=>setOpenAlert(true)} className="flex items-center gap-2 cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-md w-full"><FaRegTrashAlt />Delete</DropdownMenuItem>
            </div>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={openAlert}>

  <AlertDialogContent className="bg-white dark:bg-slate-900 border dark:border-slate-800 text-slate-900 dark:text-slate-100">
    <AlertDialogHeader>
      <AlertDialogTitle className="text-gray-900 dark:text-white">Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription className="text-gray-500 dark:text-gray-400">
        This action cannot be undone. This will permanently delete your course
        and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel onClick={() => setOpenAlert(false)} className="border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-850">Cancel</AlertDialogCancel>
      <AlertDialogAction className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => {handleOnDelete();setOpenAlert(false)}}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
    </div>
  )
}

export default DropdownOption
