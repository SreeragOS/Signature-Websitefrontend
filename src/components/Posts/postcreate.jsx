import { useState } from 'react';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
// import ParticleBackground from './particlebackground';
import './postcreate.css'; // Optional: for additional styling


function PostCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null,
    video: null,
    document: null,
    category: 'Personal',
    subcategory: '',
  });

  const categoryOptions = [
    { value: 'Personal', label: 'Personal', subcategories: [ { value: 'personal', label: 'Personal' } ] },
    { value: 'Veterinary', label: 'Veterinary', subcategories: [
      { value: 'Experiences', label: 'Experiences' },
      { value: 'case studies', label: 'Case Studies' },
      { value: 'projects', label: 'Projects' },
      { value: 'Articles', label: 'Articles' },
      { value: 'files', label: 'Files' },
    ] },
    { value: 'Literature', label: 'Literature', subcategories: [
      { value: 'Articles', label: 'Articles' },
      { value: 'stories', label: 'Stories' },
      { value: 'novels', label: 'Novels' },
      { value: 'Poems', label: 'Poems' },
      { value: 'Autobiography', label: 'Autobiography' },
    ] },
    { value: 'Art', label: 'Art', subcategories: [
      { value: 'Drawings', label: 'Drawings' },
      { value: 'paintings', label: 'Paintings' },
      { value: 'Crafts', label: 'Crafts' },
    ] },
  ];

  const handleChange = e => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
      ...(name === 'category' ? { subcategory: '' } : {}),
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    if (formData.image) data.append('image', formData.image);
    if (formData.video) data.append('video', formData.video);
    if (formData.document) data.append('document', formData.document);
    data.append('category', formData.category);
    if (formData.subcategory) data.append('subcategory', formData.subcategory);

    try {
      await api.post('posts/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/');
    } catch (err) {
      console.error('Post creation failed:', err);
    }
  };

  return (
    <div className="create-container">
  {/* <ParticleBackground /> */}
      <div className="create-form-box">
        <h2>Create New Post</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="title"
            type="text"
            placeholder="Heading"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="content"
            placeholder="Body"
            value={formData.content}
            onChange={handleChange}
            required
          />
          <label className="custom-label">Image:</label>
          <div className="custom-file-input-wrapper">
            <input
              id="image-upload"
              className="custom-file-input"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleChange}
            />
            <label htmlFor="image-upload" className="custom-file-label">
              {formData.image ? formData.image.name : 'Choose Image'}
            </label>
          </div>
          <label className="custom-label">Video:</label>
          <div className="custom-file-input-wrapper">
            <input
              id="video-upload"
              className="custom-file-input"
              name="video"
              type="file"
              accept="video/*"
              onChange={handleChange}
            />
            <label htmlFor="video-upload" className="custom-file-label">
              {formData.video ? formData.video.name : 'Choose Video'}
            </label>
          </div>
          <label className="custom-label">Category:</label>
          <select
            className="custom-select"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categoryOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <label className="custom-label">Subcategory:</label>
          <select
            className="custom-select"
            name="subcategory"
            value={formData.subcategory}
            onChange={handleChange}
            required
            disabled={!formData.category}
            style={{ marginBottom: '1.5rem' }}
          >
            <option value="">Select Subcategory</option>
            {categoryOptions.find(opt => opt.value === formData.category)?.subcategories.map(sub => (
              <option key={sub.value} value={sub.value}>{sub.label}</option>
            ))}
          </select>
          <label className="custom-label">Upload Document (ppt, pdf, docx):</label>
          <input
            name="document"
            type="file"
            accept=".ppt,.pptx,.pdf,.doc,.docx,application/vnd.ms-powerpoint,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation"
            onChange={handleChange}
            style={{ marginBottom: '1rem' }}
          />
          <button type="submit" className="create-post-btn">Create Post</button>
        </form>
      </div>
    </div>
  );
}

export default PostCreate;
