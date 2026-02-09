import React from 'react'
import Image from 'next/image';
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
function LoadingDialog({loading}) {
  return (
    <div>
      <AlertDialog open={loading} >
  <AlertDialogContent>
    <AlertDialogHeader>
     
      <AlertDialogDescription>
        <div className='flex flex-col items-center py-10'>
        <Image src="/loader.gif" width={100} height={100} alt="loading..." className='mx-auto'/>
        <h2>Please wait... AI is generating your course</h2>
        </div>
      </AlertDialogDescription>
    </AlertDialogHeader>
  </AlertDialogContent>
</AlertDialog>
    </div>
  )
}

export default LoadingDialog
