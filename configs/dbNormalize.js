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

export const normalizeChapter = (chapterRow) => {
  if (!chapterRow || !chapterRow.content) return chapterRow;
  
  const rawContent = chapterRow.content;
  let sections = [];
  
  // Helper to fetch keys case-insensitively
  const getVal = (obj, keys) => {
    if (!obj) return undefined;
    for (const k of keys) {
      if (obj[k] !== undefined) return obj[k];
    }
    return undefined;
  };

  // If rawContent is already an array
  if (Array.isArray(rawContent)) {
    sections = rawContent;
  } else if (typeof rawContent === 'object') {
    // Check common keys for arrays representing chapter segments
    const arrayVal = getVal(rawContent, [
      'chapters', 'sections', 'content', 'topics', 'lessons', 'steps',
      'அத்தியாயங்கள்', 'பிரிவுகள்', 'பாடம்'
    ]);
    
    if (Array.isArray(arrayVal)) {
      sections = arrayVal;
    } else {
      // Fallback: look for any key that contains an array
      for (const key in rawContent) {
        if (Array.isArray(rawContent[key])) {
          sections = rawContent[key];
          break;
        }
      }
    }
  }
  
  // Standardize the objects inside the array
  const normalizedSections = Array.isArray(sections) ? sections.map(item => ({
    title: getVal(item, ['title', 'chapter_name', 'name', 'heading', 'தலைப்பு', 'தலைப்பு_பெயர்', 'अध्याय_नाम']),
    description: getVal(item, ['description', 'explanation', 'content', 'விளக்கம்', 'details']),
    codeExample: getVal(item, ['codeExample', 'code', 'code_example', 'example'])
  })) : [];
  
  return {
    ...chapterRow,
    content: {
      ...rawContent,
      chapters: normalizedSections
    }
  };
};

export const normalizeCourse = (course) => {
  if (!course || !course.courseOutput) return course;
  return {
    ...course,
    courseOutput: normalizeCourseOutput(course.courseOutput)
  };
};
