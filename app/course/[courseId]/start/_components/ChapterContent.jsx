import React from 'react'
import YouTube from 'react-youtube';
import ReactMarkdown from 'react-markdown'
 const opts = {
      height: '390',
      width: '640',
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 0,
      }
 };
function ChapterContent({chapter,content}) {
  return (
    <div className='p-10'>
      <h2 className='font-medium text-2xl'>{chapter?.chapter_name}</h2>
      <p className='text-gray-500'>{chapter?.description}</p>

      <div className='flex justify-center my-6'>
      {/* Video */}
      <YouTube
      videoId={content?.videoId}
      opts={opts}/>
      </div>

      {/* Content */}
<div>
  {Array.isArray(content?.content.chapters) &&
    content.content.chapters.map((item, index) => (
      <div key={index} className='p-5 bg-sky-50 mb-3 rounded-lg'>
        <h2 className="font-medium text-lg">
          {item.title}
        </h2>
        {/* <p className='whitespace-pre-wrap'>{item.description}</p>*/}
        <ReactMarkdown>{item?.description}</ReactMarkdown>
        {item.codeExample &&<div className='p-4 bg-black text-white rounded-md mt-3'>
        <pre>
          <code><ReactMarkdown>{item.codeExample}</ReactMarkdown></code>
        </pre>
        </div>
        } 
      </div>
    ))
  }
</div>
      
    </div>
  )
}

export default ChapterContent
