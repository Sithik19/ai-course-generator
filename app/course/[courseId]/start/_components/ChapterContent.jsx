import React from 'react'
import YouTube from 'react-youtube';
import ReactMarkdown from 'react-markdown'

function ChapterContent({chapter,content}) {
  return (
    <div className='p-5 md:p-10'>
      <h2 className='font-medium text-2xl'>{chapter?.chapter_name}</h2>
      <p className='text-gray-500'>{chapter?.description}</p>

      <div className='my-6 w-full aspect-video max-w-2xl mx-auto overflow-hidden rounded-xl shadow-sm border border-gray-100 dark:border-slate-800'>
        {content?.videoId ? (
          <YouTube
            videoId={content.videoId}
            opts={{
              height: '100%',
              width: '100%',
              playerVars: {
                autoplay: 0,
              }
            }}
            className='w-full h-full'
            containerClassName='w-full h-full aspect-video'
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-gray-400 text-sm">
            No Video Selected
          </div>
        )}
      </div>

      {/* Content */}
      <div>
        {Array.isArray(content?.content?.chapters) &&
          content.content.chapters.map((item, index) => {
            const codeContent = item.codeExample || '';
            const cleanCode = typeof codeContent === 'string'
              ? codeContent.replace(/<\/?precode>/gi, '').trim()
              : JSON.stringify(codeContent, null, 2);
            
            return (
              <div key={index} className='p-5 bg-sky-50 dark:bg-slate-900 border border-transparent dark:border-slate-800 mb-3 rounded-lg'>
                <h2 className="font-medium text-lg mb-2">
                  {item.title}
                </h2>
                <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
                  <ReactMarkdown>{item?.description || ''}</ReactMarkdown>
                </div>
                {cleanCode && (
                  <div className='p-4 bg-black text-white rounded-md mt-3 overflow-x-auto font-mono text-sm'>
                    <pre>
                      <code>{cleanCode}</code>
                    </pre>
                  </div>
                )} 
              </div>
            );
          })
        }
      </div>
      
    </div>
  )
}

export default ChapterContent
