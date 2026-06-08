import { pgTable, serial, varchar, json , integer } from 'drizzle-orm/pg-core';   


export const CourseList=pgTable('courseList',{
    id:serial('id').primaryKey(),
    courseId:varchar('courseId').notNull(),
    name:varchar('name').notNull(),
    category:varchar('category').notNull(),
    level:varchar('level').notNull(),
    includeVideo:varchar('includeVideo').notNull().default('Yes'),
    courseOutput:json('courseOutput').notNull(),
    createdBy:varchar('createdBy').notNull(),
    userName:varchar('username'),
    userProfileImage:varchar('userProfileImage'),
    language:varchar('language').notNull().default('English')

});

export const Chapters=pgTable('chapters', {
    id:serial('id').primaryKey(),
    courseId: varchar('courseid').notNull(),
    chapterId:integer('chapterId').notNull(),
    content:json('content').notNull(),
    videoId: varchar('videoId').notNull()
})

export const Subscriptions=pgTable('subscriptions', {
    id:serial('id').primaryKey(),
    email:varchar('email').notNull(),
    utr:varchar('utr').notNull().unique(),
    amount:varchar('amount').notNull(),
    plan:varchar('plan').notNull(),
    status:varchar('status').notNull().default('pending'), // 'pending', 'approved', 'rejected'
    createdAt:varchar('createdAt').notNull()
})

