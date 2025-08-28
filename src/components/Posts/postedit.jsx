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
    <div className="form-wrapper">
      <div className="form-box">
        <h2>Edit Post</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            required
          />
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Content"
            rows="5"
            required
          />
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
          <button type="submit">Update</button>
        </form>
      </div>
    </div>
  );
}

export default PostEdit;
