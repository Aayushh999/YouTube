import React, { useState } from 'react';
import { SimpleLoader } from 'spinny-loader';

function PublishVideo({closePopup}) {
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = (e) => {
    // const file = e.target.files[0];
    // if (file) {
    //   setFile(file);
    // }
    const { name, files } = e.target;
    // console.log(name, files[0]);

    if (name === 'videoFile') {
      setVideoFile(files[0]);
    } 
    else if (name === 'thumbnail') {
      setThumbnail(files[0]);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    console.log({ title, description, videoFile, thumbnail });

    if (!title || !description || !videoFile || !thumbnail) {
      setError('All fields are required');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('videoFile', videoFile);
    formData.append('thumbnail', thumbnail);

    try {
      setIsLoading(true);

      // TODO: Check The API CALL
      const response = await fetch('http://localhost:8000/api/v1/videos',{
        method: 'POST',
        body: formData,
        // headers: {
        //   'Content-Type': 'multipart/form-data',
        // },
        withCredentials: true,
      });

      console.log('Video published successfully:', response.data);
      setIsLoading(false);
      closePopup();

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Publishing failed');
      } else {
        console.log('Video published successfully');
        // Reset form
        setTitle('');
        setDescription('');
        setVideoFile(null);
        setThumbnail(null);
      }
    } catch (error) {
      console.error('Error publishing video:', error);
      setIsLoading(false);
      setError('Error publishing video');
    }
  };

  return (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
    <div className='flex justify-center items-center min-h-screen'>
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className='text-2xl mb-5 text-center font-semibold'>Publish Video</h2>
        <form onSubmit={handlePublish}>
          <div className='mb-3'>
            <input
              id="title"
              type="text"
              placeholder='Title*'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='w-full px-4 py-2 border bg-blue-50 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500'
              required
            />
          </div>

          <div className='mb-3'>
            <textarea
              placeholder='Description*'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='w-full px-4 py-2 border bg-blue-50 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500'
              required
            />
          </div>

          <div className='mb-4'>
            <label className='block text-left text-gray-600 text-sm mb-1'>Video File*</label>
            <input
              id="videoFile"
              type="file"
              name="videoFile"
              accept="video/*"
              onChange={(e) => handleFileChange(e)}
              className='w-full px-4 py-2 border bg-blue-50 border-gray-300 rounded-md focus:outline-none'
              required
            />
          </div>

          <div className='mb-4'>
            <label className='block text-left text-gray-600 text-sm mb-1'>Thumbnail*</label>
            <input
              id="thumbnail"
              type="file"
              name="thumbnail"
              accept="image/*"
              onChange={(e) => handleFileChange(e)}
              className='w-full px-4 py-2 border bg-blue-50 border-gray-300 rounded-md focus:outline-none'
              required
            />
          </div>

          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

          <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
              disabled={isLoading}
            >
              {isLoading ? 'Publishing...' : 'Publish'}
            </button>
            <button
              type="button"
              onClick={closePopup}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 ml-2"
            >
              Cancel
            </button>
        </form>
      </div>
    </div>
  </div>
  );
}

export default PublishVideo;
