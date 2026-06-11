import React, { useState, useEffect } from 'react';
import { cmsService } from '../../services/cmsService';
import { Edit, Trash2, Plus, CheckCircle, Globe, LayoutTemplate, FileText } from 'lucide-react';

export const CMSManagement = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    status: 'DRAFT'
  });

  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await cmsService.getPages();
      setPages(res.data);
    } catch (err) {
      setError('Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleOpenModal = (page = null) => {
    setEditingPage(page);
    if (page) {
      setFormData({
        title: page.title,
        slug: page.slug,
        description: page.description || '',
        status: page.status
      });
    } else {
      setFormData({ title: '', slug: '', description: '', status: 'DRAFT' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPage(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPage) {
        await cmsService.updatePage(editingPage.id, formData);
      } else {
        await cmsService.createPage(formData);
      }
      await fetchPages();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      try {
        await cmsService.deletePage(id);
        await fetchPages();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete');
      }
    }
  };

  const handlePublish = async (id) => {
    try {
      await cmsService.publishPage(id);
      await fetchPages();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to publish');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <LayoutTemplate className="w-8 h-8 text-indigo-600" />
            Content Management
          </h1>
          <p className="mt-1 text-gray-500">Manage pages, slugs, and publish status</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Create New Page
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pages.map((page) => (
              <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{page.title}</div>
                      <div className="text-xs text-gray-500 font-mono">/{page.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    page.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                    page.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {page.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(page.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  {page.status !== 'PUBLISHED' && (
                    <button onClick={() => handlePublish(page.id)} title="Publish" className="text-green-600 hover:text-green-900">
                      <Globe className="w-5 h-5 inline" />
                    </button>
                  )}
                  <button onClick={() => handleOpenModal(page)} title="Edit" className="text-blue-600 hover:text-blue-900">
                    <Edit className="w-5 h-5 inline" />
                  </button>
                  <button onClick={() => handleDelete(page.id)} title="Delete" className="text-red-600 hover:text-red-900">
                    <Trash2 className="w-5 h-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingPage ? 'Edit Page' : 'Create Page'}
            </h2>
            {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Slug</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border font-mono"
                  placeholder="e.g. about-us"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  {editingPage ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
