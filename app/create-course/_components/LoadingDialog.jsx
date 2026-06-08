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
      <AlertDialogTitle className="sr-only">Generating Course Layout</AlertDialogTitle>
      <AlertDialogDescription asChild>
        <div className='flex flex-col items-center py-10'>
          <Image src="/loader.gif" width={100} height={100} alt="loading..." className='mx-auto'/>
          <p className="text-gray-900 dark:text-white font-medium text-lg mt-4 text-center">Please wait... AI is generating your course</p>
        </div>
      </AlertDialogDescription>
    </AlertDialogHeader>
  </AlertDialogContent>
</AlertDialog>
    </div>
  )
}

export default LoadingDialog
