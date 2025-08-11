import React, { useState, useEffect } from 'react';
import type {Event, EventFormData, Category} from '../../types';
import CategoryService from '../../services/categoryService';
import './Form.css';

interface EventFormProps {
  event?: Event;
  onSubmit: (data: EventFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const EventForm: React.FC<EventFormProps> = ({
  event,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    eventDate: '',
    location: '',
    categoryId: 0,
    tags: '',
    maxCapacity: undefined
  });
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<Partial<EventFormData>>({});

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        eventDate: event.eventDate.replace('Z', '').slice(0, 16), // Format for datetime-local input
        location: event.location,
        categoryId: event.categoryId,
        tags: event.tags ? event.tags.map(tag => tag.name).join(', ') : '',
        maxCapacity: event.maxCapacity || undefined
      });
    }
  }, [event]);

  const fetchCategories = async () => {
    try {
      const data = await CategoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let processedValue: unknown = value;
    
    if (type === 'number') {
      processedValue = value === '' ? undefined : parseInt(value, 10);
    } else if (name === 'categoryId') {
      processedValue = parseInt(value, 10);
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Clear error when user starts typing
    if (errors[name as keyof EventFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<EventFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Event description is required';
    }

    if (!formData.eventDate) {
      newErrors.eventDate = 'Event date is required';
    } else {
      const eventDateTime = new Date(formData.eventDate);
      if (eventDateTime <= new Date()) {
        newErrors.eventDate = 'Event date must be in the future';
      }
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Event location is required';
    }

    if (!formData.categoryId || formData.categoryId === 0) {
      newErrors.categoryId = -1;
    }

    if (formData.maxCapacity !== undefined && formData.maxCapacity < 1) {
      newErrors.maxCapacity = -1;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <label htmlFor="title">Event Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={errors.title ? 'error' : ''}
          placeholder="Enter event title"
        />
        {errors.title && <span className="error-text">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={errors.description ? 'error' : ''}
          rows={4}
          placeholder="Enter event description"
        />
        {errors.description && <span className="error-text">{errors.description}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="eventDate">Event Date & Time *</label>
          <input
            type="datetime-local"
            id="eventDate"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            className={errors.eventDate ? 'error' : ''}
          />
          {errors.eventDate && <span className="error-text">{errors.eventDate}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="location">Location *</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={errors.location ? 'error' : ''}
            placeholder="Event location"
          />
          {errors.location && <span className="error-text">{errors.location}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="categoryId">Category *</label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className={errors.categoryId ? 'error' : ''}
          >
            <option value={0}>Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <span className="error-text">{errors.categoryId}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="maxCapacity">Max Capacity (Optional)</label>
          <input
            type="number"
            id="maxCapacity"
            name="maxCapacity"
            value={formData.maxCapacity || ''}
            onChange={handleChange}
            className={errors.maxCapacity ? 'error' : ''}
            placeholder="Leave empty for unlimited"
            min="1"
          />
          {errors.maxCapacity && <span className="error-text">{errors.maxCapacity}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="tags">Tags (Optional)</label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Enter tags separated by commas (e.g., music, rock, concert)"
        />
        <small style={{ color: '#666', fontSize: '0.9rem' }}>
          Separate multiple tags with commas
        </small>
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : (event ? 'Update Event' : 'Create Event')}
        </button>
      </div>
    </form>
  );
};

export default EventForm;