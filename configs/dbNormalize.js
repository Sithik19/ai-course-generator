export const normalizeCourseOutput = (co) => {
  if (!co) return co;

  // Helper function to resolve keys case-insensitively or with spaces
  const getVal = (obj, keys) => {
    if (!obj) return undefined;
    for (const k of keys) {
      if (obj[k] !== undefined) return obj[k];
    }
    return undefined;
  };

  const course_name = getVal(co, ['course_name', 'Course Name', 'courseName', 'CourseName']);
  const description = getVal(co, ['description', 'Description']);
  const category = getVal(co, ['category', 'Category']);
  const topic = getVal(co, ['topic', 'Topic']);
  const level = getVal(co, ['level', 'Level']);
  const duration = getVal(co, ['duration', 'Duration']);
  
  let chapters = getVal(co, ['chapters', 'Chapters']) || [];
  if (Array.isArray(chapters)) {
    chapters = chapters.map(ch => ({
      ...ch,
      chapter_name: getVal(ch, ['chapter_name', 'Chapter Name', 'chapterName', 'ChapterName']),
      about: getVal(ch, ['about', 'About']),
      duration: getVal(ch, ['duration', 'Duration'])
    }));
  }

  return {
    ...co,
    course_name,
    description,
    category,
    topic,
    level,
    duration,
    chapters
  };
};

export const normalizeCourse = (course) => {
  if (!course || !course.courseOutput) return course;
  return {
    ...course,
    courseOutput: normalizeCourseOutput(course.courseOutput)
  };
};
