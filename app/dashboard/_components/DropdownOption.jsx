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
        <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
        <DropdownMenuContent >
            <div className='flex items-center gap-1'>
          <DropdownMenuItem onClick={()=>setOpenAlert(true)}><FaRegTrashAlt />Delete</DropdownMenuItem>
            </div>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={openAlert}>

  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your course
        and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel onClick={() => setOpenAlert(false)}>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={() => {handleOnDelete();setOpenAlert(false)}}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
    </div>
  )
}

export default DropdownOption
