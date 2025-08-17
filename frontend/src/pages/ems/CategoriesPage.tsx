import React, { useState, useEffect } from 'react';
import EMSLayout from '../../components/ems/EMSLayout';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import CategoryForm from '../../components/ems/CategoryForm';
import type {Category, CategoryFormData} from '../../types';
import {CategoryService} from '../../services/categoryService';
import {extractResponseData, handleApiError} from '../../services/api';

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageLimit] = useState(10);

  useEffect(() => {
    fetchCategories();
  }, [currentPage]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await CategoryService.getCategoriesPaginated(currentPage, pageLimit);
      
      // Use utility function to extract data
      setCategories(extractResponseData(response));
      
      // Calculate total pages from total count
      if (response.total) {
        setTotalPages(Math.ceil(response.total / pageLimit));
      }
    } catch (error) {
      const errorMessage = handleApiError(error, 'Error loading categories');
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCategory(undefined);
    setModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  const handleDelete = async (category: Category) => {
    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) {
      return;
    }

    try {
      setDeleteLoading(category.id);
      await CategoryService.deleteCategory(category.id);
      await fetchCategories();
    } catch (error: any) {
      if (error.response?.status === 400 || error.response?.data?.message?.includes('events')) {
        alert('Cannot delete category that has events associated with it');
      } else {
        const errorMessage = handleApiError(error, 'Error deleting category');
        alert(errorMessage);
      }
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleFormSubmit = async (formData: CategoryFormData) => {
    try {
      setFormLoading(true);
      
      if (editingCategory) {
        await CategoryService.updateCategory(editingCategory.id, formData);
      } else {
        await CategoryService.createCategory(formData);
      }
      
      setModalOpen(false);
      await fetchCategories();
    } catch (error: any) {
      if (error.response?.status === 409) {
        alert('A category with this name already exists');
      } else {
        const errorMessage = handleApiError(error, 'Error saving category');
        alert(errorMessage);
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingCategory(undefined);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns = [
    { key: 'name' as const, label: 'Name' },
    { key: 'description' as const, label: 'Description' },
    {
      key: 'actions' as const,
      label: 'Actions',
      render: (category: Category) => (
        <div className="table-actions">
          <button
            onClick={() => handleEdit(category)}
            className="btn btn-sm btn-primary"
            disabled={deleteLoading === category.id}
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(category)}
            className="btn btn-sm btn-danger"
            disabled={deleteLoading === category.id}
          >
            {deleteLoading === category.id ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      )
    }
  ];

  return (
    <EMSLayout>
      <div className="page-header">
        <h1>Categories</h1>
        <p>Manage event categories</p>
      </div>

      <div className="content-card">
        <div className="card-header">
          <h2>All Categories</h2>
          <button onClick={handleCreate} className="btn btn-primary">
            Add New Category
          </button>
        </div>
        <div className="card-content">
          <Table
            data={categories}
            columns={columns}
            loading={loading}
            emptyMessage="No categories found. Create your first category!"
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={handleModalClose}
        title={editingCategory ? 'Edit Category' : 'Create New Category'}
      >
        <CategoryForm
          category={editingCategory}
          onSubmit={handleFormSubmit}
          onCancel={handleModalClose}
          loading={formLoading}
        />
      </Modal>
    </EMSLayout>
  );
};

export default CategoriesPage;