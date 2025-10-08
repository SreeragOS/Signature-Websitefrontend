import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './postcreate.css';

function PostEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null,
  });

  useEffect(() => {
    api.get(`posts/${id}/`)
      .then(res => {
        setFormData({
          title: res.data.title,
          content: res.data.content,
          image: null,  // don’t prefill image
        });
      })
      .catch(err => {
        console.error(err);
        alert("Failed to load post data.");
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('title', formData.title);
    form.append('content', formData.content);
    if (formData.image) form.append('image', formData.image);

    api.put(`posts/${id}/`, form)
      .then(() => navigate('/'))
      .catch(err => {
        console.error(err);
        alert('Failed to update post.');
      });
  };

  return (
    <div className="form-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="form-box" style={{ background: '#f7faf5', padding: '2.2rem 2.5rem', borderRadius: '12px', boxShadow: '0 8px 20px rgba(0,0,0,0.07)', maxWidth: '420px', width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontWeight: 700 }}>Edit Post</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <label style={{ fontWeight: 600, marginBottom: '0.3rem' }} htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            required
            style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1.08rem' }}
          />
          <label style={{ fontWeight: 600, marginBottom: '0.3rem' }} htmlFor="content">Content</label>
          <textarea
            name="content"
            id="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Content"
            rows="5"
            required
            style={{ padding: '0.7rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1.08rem', resize: 'vertical' }}
          />
          <label style={{ fontWeight: 600, marginBottom: '0.3rem' }} htmlFor="image">Image</label>
          <input
            type="file"
            name="image"
            id="image"
            accept="image/*"
            onChange={handleChange}
            style={{ fontSize: '1.08rem' }}
          />
          <button type="submit" style={{ background: '#2563eb', color: 'white', padding: '0.7rem 1.2rem', borderRadius: '6px', fontWeight: 700, border: 'none', fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>Update</button>
        </form>
      </div>
    </div>
  );
}

export default PostEdit;
