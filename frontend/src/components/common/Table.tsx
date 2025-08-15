import React from 'react';
import Pagination from './Pagination';
import './Table.css';

interface Column<T> {
  key: keyof T | 'actions';
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  // Pagination props
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

function Table<T extends { id: number }>({ 
  data, 
  columns, 
  loading = false, 
  emptyMessage = 'No data available',
  currentPage,
  totalPages,
  onPageChange
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="table-loading">
        <p>Loading...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="table-empty">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              {columns.map((column) => (
                <td key={String(column.key)}>
                  {column.render ? (
                    column.render(item)
                  ) : (
                    String(item[column.key as keyof T] || '')
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {currentPage && totalPages && onPageChange && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          loading={loading}
        />
      )}
    </div>
  );
}

export default Table;