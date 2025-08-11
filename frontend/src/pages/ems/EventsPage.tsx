import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EMSLayout from '../../components/ems/EMSLayout';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import EventForm from '../../components/ems/EventForm';
import type {Event, EventFormData} from '../../types';
import { useAuth } from '../../hooks/useAuth';
import EventService from '../../services/eventService';

const EventsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>();
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await EventService.getAllEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      alert('Error loading events');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingEvent(undefined);
    setModalOpen(true);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setModalOpen(true);
  };

  const handleDelete = async (event: Event) => {
    if (!confirm(`Are you sure you want to delete "${event.title}"?`)) {
      return;
    }

    try {
      setDeleteLoading(event.id);
      await EventService.deleteEvent(event.id);
      await fetchEvents();
    } catch (error: any) {
      console.error('Error deleting event:', error);
      alert('Error deleting event');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleFormSubmit = async (formData: EventFormData) => {
    try {
      setFormLoading(true);
      
      // Convert datetime-local format back to ISO format
      const eventData = {
        ...formData,
        eventDate: new Date(formData.eventDate).toISOString(),
        authorId: user!.id // Current user is the author
      };
      
      if (editingEvent) {
        await EventService.updateEvent(editingEvent.id, eventData);
      } else {
        await EventService.createEvent(eventData);
      }
      
      setModalOpen(false);
      await fetchEvents();
    } catch (error: any) {
      console.error('Error saving event:', error);
      alert('Error saving event');
    } finally {
      setFormLoading(false);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingEvent(undefined);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const handleViewEvent = (event: Event) => {
    // Navigate to event in same tab
    navigate(`/event/${event.id}`);
  };

  const columns = [
    { 
      key: 'title' as const, 
      label: 'Title',
      render: (event: Event) => (
        <div>
          <strong>{event.title}</strong>
          <br />
          <small style={{ color: '#666' }}>
            {event.category?.name || 'Unknown Category'}
          </small>
        </div>
      )
    },
    { 
      key: 'description' as const, 
      label: 'Description',
      render: (event: Event) => truncateText(event.description)
    },
    { 
      key: 'eventDate' as const, 
      label: 'Event Date',
      render: (event: Event) => formatDate(event.eventDate)
    },
    { 
      key: 'location' as const, 
      label: 'Location' 
    },
    { 
      key: 'views' as const, 
      label: 'Views' 
    },
    {
      key: 'actions' as const,
      label: 'Actions',
      render: (event: Event) => (
        <div className="table-actions">
          <button
            onClick={() => handleViewEvent(event)}
            className="btn btn-sm btn-secondary"
            title="View on public site"
          >
            View
          </button>
          <button
            onClick={() => handleEdit(event)}
            className="btn btn-sm btn-primary"
            disabled={deleteLoading === event.id}
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(event)}
            className="btn btn-sm btn-danger"
            disabled={deleteLoading === event.id}
          >
            {deleteLoading === event.id ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      )
    }
  ];

  return (
    <EMSLayout>
      <div className="page-header">
        <h1>Events</h1>
        <p>Manage your events</p>
      </div>

      <div className="content-card">
        <div className="card-header">
          <h2>All Events</h2>
          <button onClick={handleCreate} className="btn btn-primary">
            Create New Event
          </button>
        </div>
        <div className="card-content">
          <Table
            data={events}
            columns={columns}
            loading={loading}
            emptyMessage="No events found. Create your first event!"
          />
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={handleModalClose}
        title={editingEvent ? 'Edit Event' : 'Create New Event'}
        size="large"
      >
        <EventForm
          event={editingEvent}
          onSubmit={handleFormSubmit}
          onCancel={handleModalClose}
          loading={formLoading}
        />
      </Modal>
    </EMSLayout>
  );
};

export default EventsPage;