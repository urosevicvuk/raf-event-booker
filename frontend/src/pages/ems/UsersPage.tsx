import React, { useState, useEffect } from 'react';
import EMSLayout from '../../components/ems/EMSLayout';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import UserForm from '../../components/ems/UserForm';
import type {User, UserFormData} from '../../types';
import UserService from '../../services/userService';
import './UsersPage.css';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>();
  const [formLoading, setFormLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<{ userId: number; action: string } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await UserService.getAllUsers(undefined, false); // Get all users (active + inactive)
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Error loading users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingUser(undefined);
    setModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleDelete = async (user: User) => {
    if (user.userType === 'admin') {
      alert('Cannot delete admin users');
      return;
    }

    if (!confirm(`Are you sure you want to delete "${user.firstName} ${user.lastName}"?`)) {
      return;
    }

    try {
      setActionLoading({ userId: user.id, action: 'delete' });
      await UserService.deleteUser(user.id);
      await fetchUsers();
    } catch (error: unknown) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleActivate = async (user: User) => {
    try {
      setActionLoading({ userId: user.id, action: 'activate' });
      await UserService.activateUser(user.id);
      await fetchUsers();
    } catch (error: unknown) {
      console.error('Error activating user:', error);
      alert('Error activating user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeactivate = async (user: User) => {
    if (user.userType === 'admin') {
      alert('Cannot deactivate admin users');
      return;
    }

    if (!confirm(`Are you sure you want to deactivate "${user.firstName} ${user.lastName}"?`)) {
      return;
    }

    try {
      setActionLoading({ userId: user.id, action: 'deactivate' });
      await UserService.deactivateUser(user.id);
      await fetchUsers();
    } catch (error: unknown) {
      console.error('Error deactivating user:', error);
      alert('Error deactivating user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleFormSubmit = async (formData: UserFormData) => {
    try {
      setFormLoading(true);
      
      if (editingUser) {
        // Remove password fields when editing
        const { password: _password, confirmPassword: _confirmPassword, ...updateData } = formData;
        await UserService.updateUser(editingUser.id, updateData);
      } else {
        await UserService.createUser(formData);
      }
      
      setModalOpen(false);
      await fetchUsers();
    } catch (error: any) {
      console.error('Error saving user:', error);
      if (error.response?.status === 409) {
        alert('A user with this email already exists');
      } else {
        alert('Error saving user');
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingUser(undefined);
  };

  const isActionLoading = (userId: number, action: string) => {
    return actionLoading?.userId === userId && actionLoading?.action === action;
  };

  const columns = [
    { 
      key: 'firstName' as const, 
      label: 'Name',
      render: (user: User) => `${user.firstName} ${user.lastName}`
    },
    { key: 'email' as const, label: 'Email' },
    { 
      key: 'userType' as const, 
      label: 'User Type',
      render: (user: User) => (
        <span className={`user-type ${user.userType === 'admin' ? 'admin' : 'creator'}`}>
          {user.userType}
        </span>
      )
    },
    { 
      key: 'status' as const, 
      label: 'Status',
      render: (user: User) => (
        <span className={`status ${user.status}`}>
          {user.status}
        </span>
      )
    },
    {
      key: 'actions' as const,
      label: 'Actions',
      render: (user: User) => (
        <div className="table-actions">
          <button
            onClick={() => handleEdit(user)}
            className="btn btn-sm btn-primary"
            disabled={actionLoading?.userId === user.id}
          >
            Edit
          </button>
          
          {user.status === 'active' && user.userType !== 'admin' && (
            <button
              onClick={() => handleDeactivate(user)}
              className="btn btn-sm btn-warning"
              disabled={actionLoading?.userId === user.id}
            >
              {isActionLoading(user.id, 'deactivate') ? 'Deactivating...' : 'Deactivate'}
            </button>
          )}
          
          {user.status === 'inactive' && (
            <button
              onClick={() => handleActivate(user)}
              className="btn btn-sm btn-success"
              disabled={actionLoading?.userId === user.id}
            >
              {isActionLoading(user.id, 'activate') ? 'Activating...' : 'Activate'}
            </button>
          )}
          
          {user.userType !== 'admin' && (
            <button
              onClick={() => handleDelete(user)}
              className="btn btn-sm btn-danger"
              disabled={actionLoading?.userId === user.id}
            >
              {isActionLoading(user.id, 'delete') ? 'Deleting...' : 'Delete'}
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <EMSLayout>
      <div className="page-header">
        <h1>Users</h1>
        <p>Manage system users (Admin only)</p>
      </div>

      <div className="content-card">
        <div className="card-header">
          <h2>All Users</h2>
          <button onClick={handleCreate} className="btn btn-primary">
            Create New User
          </button>
        </div>
        <div className="card-content">
          <Table
            data={users}
            columns={columns}
            loading={loading}
            emptyMessage="No users found."
          />
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={handleModalClose}
        title={editingUser ? 'Edit User' : 'Create New User'}
      >
        <UserForm
          user={editingUser}
          onSubmit={handleFormSubmit}
          onCancel={handleModalClose}
          loading={formLoading}
        />
      </Modal>

    </EMSLayout>
  );
};

export default UsersPage;