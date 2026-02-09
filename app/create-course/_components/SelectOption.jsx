"use client"
import React from 'react'
import { Input } from "@/components/ui/input"
import { useContext } from "react";
import { UserInputContext } from "@/app/_context/UserInputContext";


import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

function SelectOption() {

    const { userCourseInput, setUserCourseInput } = useContext(UserInputContext);
    
    const handleInputChange = (fieldName,value) => {
    setUserCourseInput(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

    return (
        <div className='px-10 md:px-20 lg:px-44'>
            <div className='grid grid-cols-2 gap-10'>
                <div>
                    <label className='text-sm'>Difficulty Level</label>
                    <Select onValueChange={(value)=>handleInputChange('level',value)} 
                     defaultValue={userCourseInput?.level}>
                        <SelectTrigger className="h-14 w-full text-lg">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermidiate">Intermidiate</SelectItem>
                            <SelectItem value="Advance">Advance</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label className='text-sm'>Course Duration</label>
                    <Select onValueChange={(value)=>handleInputChange('duration',value)}
                        defaultValue={userCourseInput?.duration}>
                        <SelectTrigger className="h-14 w-full text-lg">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1 Hour">1 Hours</SelectItem>
                            <SelectItem value="2 Hours">2 Hours</SelectItem>
                            <SelectItem value="More than 3 Hours">More than 3 Hours</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label className='text-sm'>Display Video</label>
                    <Select onValueChange={(value)=>handleInputChange('displayVideo',value)}
                        defaultValue={userCourseInput?.displayVideo}>
                        <SelectTrigger className="h-14 w-full text-lg">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label className='text-sm'>Number of Chapters</label>
                    <Input type="number" className=""
                    defaultValue={userCourseInput?.noOfChapter}
                     onChange={(event)=>handleInputChange('noOfChapter',event.target.value)}/>
                </div>

                
            </div>
        </div>
    )
}

export default SelectOption
