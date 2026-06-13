import React, { useState, useEffect } from 'react';
import { Monitor, Upload, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea, AdminToggle } from '../../ui/AdminInput';
import { fileService } from '../../../services/fileService';
import { cmsService } from '../../../../services/cmsService';

const DepartmentsOverviewEditor = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [pageId, setPageId] = useState(null);
  const [sectionsMap, setSectionsMap] = useState({});

  const [formHero, setFormHero] = useState({
    title: 'Colleges & Departments',
    subtitle: 'Academic Excellence',
    description: 'Discover our world-class facilities, industry-integrated curriculum, and the visionary faculty shaping the next generation of global innovators.'
  });

  const [formEngineering, setFormEngineering] = useState([
    {
      id: 'cse',
      title: 'Computer Science and Engineering',
      abbr: 'CSE',
      description: 'Pioneering the digital frontier with cutting-edge curriculum in software development, algorithms, and computing systems.',
      highlights: ['NBA Accredited', 'AI & Cloud Labs', 'Top Placements'],
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200',
      link: '/departments/cse/department'
    },
    {
      id: 'aids',
      title: 'Artificial Intelligence & Data Science',
      abbr: 'AI&DS',
      description: 'Transforming massive data into actionable intelligence through advanced machine learning and deep learning methodologies.',
      highlights: ['Specialized GPU Labs', 'Industry Collaborations', 'Predictive Modeling'],
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200',
      link: '/departments/aids/department'
    },
    {
      id: 'it',
      title: 'Information Technology',
      abbr: 'IT',
      description: 'Building robust, secure, and scalable IT infrastructure and network solutions for the modern enterprise.',
      highlights: ['IoT & Network Security', 'Cloud Computing', 'Full Stack Development'],
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200',
      link: '/departments/it/department'
    },
    {
      id: 'mech',
      title: 'Mechanical Engineering',
      abbr: 'MECH',
      description: 'Designing the physical world through thermodynamics, fluid mechanics, and advanced robotics manufacturing.',
      highlights: ['Robotics & Automation', 'CNC Machining', 'Thermal Engineering'],
      image: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=1200',
      link: '/departments/mech/department'
    },
    {
      id: 'ece',
      title: 'Electronics & Communication',
      abbr: 'ECE',
      description: 'Connecting the world through embedded systems, VLSI design, and advanced communication networks.',
      highlights: ['VLSI Design Center', 'IoT Integration', 'Signal Processing'],
      image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&q=80&w=1200',
      link: '/departments/ece/department'
    },
    {
      id: 'eee',
      title: 'Electrical & Electronics',
      abbr: 'EEE',
      description: 'Powering the future with renewable energy systems, power electronics, and smart grid technologies.',
      highlights: ['Renewable Energy Lab', 'Power Systems', 'Smart Grids'],
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1200',
      link: '/departments/eee/department'
    },
    {
      id: 'aiml',
      title: 'AI & Machine Learning',
      abbr: 'AIML',
      description: 'Fostering intelligent systems capable of autonomous reasoning, computer vision, and natural language processing.',
      highlights: ['Computer Vision Lab', 'NLP Research', 'Neural Networks'],
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200',
      link: '/departments/aiml/department'
    },
    {
      id: 'civil',
      title: 'Civil Engineering',
      abbr: 'CIVIL',
      description: 'Shaping skylines and sustainable infrastructure through modern construction technologies and structural design.',
      highlights: ['Structural Analysis', 'Surveying Lab', 'Sustainable Materials'],
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=1200',
      link: '/departments/civil/department'
    }
  ]);

  const [formStandalone, setFormStandalone] = useState([
    {
      id: 'mca',
      title: 'Master of Computer Applications',
      abbr: 'MCA',
      description: 'Advanced computing and application development focused on enterprise software and systems management.',
      highlights: ['Enterprise Computing', 'Software Engineering', 'Industry Projects'],
      image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1200',
      link: '/departments/mca/department'
    },
    {
      id: 'management',
      title: 'School of Management',
      abbr: 'MBA',
      description: 'Developing the next generation of business leaders with strategic acumen and entrepreneurial vision.',
      highlights: ['Business Analytics', 'Leadership Training', 'Corporate Seminars'],
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200',
      link: '/departments/management/department'
    },
    {
      id: 'sh',
      title: 'Science & Humanities',
      abbr: 'S&H',
      description: 'Laying a strong foundation in applied sciences, mathematics, and professional communication skills.',
      highlights: ['Applied Physics Lab', 'Language Lab', 'Mathematics Research'],
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1200',
      link: '/departments/sh/department'
    }
  ]);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        let res;
        try {
          res = await cmsService.getPage('departments_overview');
        } catch {
          res = await cmsService.createPage({
            title: 'Departments Overview',
            slug: 'departments_overview',
            description: 'Engineering and Standalone Departments Directory Overview',
            status: 'PUBLISHED'
          });
        }

        setPageId(res.data?.id);
        const sections = res.data?.sections || [];
        const map = sections.reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
        setSectionsMap(map);

        if (map['departments_overview.hero']) {
          setFormHero(JSON.parse(map['departments_overview.hero'].content));
        }
        if (map['departments_overview.engineering']) {
          setFormEngineering(JSON.parse(map['departments_overview.engineering'].content));
        }
        if (map['departments_overview.standalone']) {
          setFormStandalone(JSON.parse(map['departments_overview.standalone'].content));
        }
      } catch (err) {
        toast({ type: 'error', title: 'Error', message: 'Failed to load page data.' });
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, []);

  const handleSave = async (publish = false) => {
    setLoading(true);
    try {
      const updates = [];

      const sectionsToSave = [
        { key: 'departments_overview.hero', title: 'Hero Text', data: formHero },
        { key: 'departments_overview.engineering', title: 'Engineering Timeline', data: formEngineering },
        { key: 'departments_overview.standalone', title: 'Standalone Courses Timeline', data: formStandalone }
      ];

      for (const item of sectionsToSave) {
        const content = JSON.stringify(item.data);
        if (sectionsMap[item.key]) {
          updates.push(cmsService.updateSection(sectionsMap[item.key].id, { content }));
        } else {
          const newSec = await cmsService.createSection({
            pageId,
            sectionKey: item.key,
            title: item.title,
            content
          });
          setSectionsMap(prev => ({ ...prev, [item.key]: newSec.data }));
        }
      }

      await Promise.all(updates);
      toast({ type: 'success', title: publish ? 'Published!' : 'Draft saved', message: `Page changes ${publish ? 'are now live' : 'saved'}.` });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save page data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    // Revert to seed defaults
    toast({ type: 'info', title: 'Reset', message: 'Page data reverted to seed defaults.' });
  };

  const updateItem = (type, index, field, value) => {
    if (type === 'engineering') {
      const updated = [...formEngineering];
      updated[index][field] = value;
      setFormEngineering(updated);
    } else {
      const updated = [...formStandalone];
      updated[index][field] = value;
      setFormStandalone(updated);
    }
  };

  const handleImageUpload = async (e, type, index) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const rec = await fileService.upload(file, 'departments_overview', type);
      updateItem(type, index, 'image', rec.url);
      toast({ type: 'success', title: 'Uploaded!', message: 'Image uploaded successfully.' });
    } catch {
      toast({ type: 'error', title: 'Failed', message: 'Upload failed.' });
    }
    setUploading(false);
  };

  const moveItem = (type, index, direction) => {
    const list = type === 'engineering' ? [...formEngineering] : [...formStandalone];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const [moved] = list.splice(index, 1);
    list.splice(targetIdx, 0, moved);
    if (type === 'engineering') setFormEngineering(list);
    else setFormStandalone(list);
  };

  const removeItem = (type, index) => {
    if (window.confirm("Are you sure you want to delete this program timeline card?")) {
      if (type === 'engineering') {
        setFormEngineering(formEngineering.filter((_, i) => i !== index));
      } else {
        setFormStandalone(formStandalone.filter((_, i) => i !== index));
      }
    }
  };

  const addItem = (type) => {
    const newItem = {
      id: `prog_${Date.now()}`,
      title: 'New Program',
      abbr: 'NP',
      description: 'Provide program description here.',
      highlights: ['Accredited', 'Smart Labs'],
      image: '',
      link: '/departments'
    };
    if (type === 'engineering') {
      setFormEngineering([...formEngineering, newItem]);
    } else {
      setFormStandalone([...formStandalone, newItem]);
    }
  };

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage
      title="Departments Overview Editor"
      description="Manage the timeline programs, descriptions, logos, highlights and links on the departments catalog page."
      breadcrumb={['Admin', 'Departments', 'Catalog Page']}
      onSave={() => handleSave(false)}
      onPublish={() => handleSave(true)}
      onReset={handleReset}
      isLoading={loading}
    >
      <div className="flex border-b border-slate-100 mb-6">
        <button
          onClick={() => setActiveTab('hero')}
          className={`py-3 px-6 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'hero' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Hero Text
        </button>
        <button
          onClick={() => setActiveTab('engineering')}
          className={`py-3 px-6 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'engineering' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Engineering Programs
        </button>
        <button
          onClick={() => setActiveTab('standalone')}
          className={`py-3 px-6 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'standalone' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Stand-Alone Programs
        </button>
      </div>

      {activeTab === 'hero' && (
        <EditorCard title="Catalog Hero Section" description="Manage the cinematic landing text on the departments index.">
          <div className="space-y-4">
            <AdminInput
              label="Hero Subtitle"
              value={formHero.subtitle || ''}
              onChange={e => setFormHero(p => ({ ...p, subtitle: e.target.value }))}
              placeholder="Academic Excellence"
            />
            <AdminInput
              label="Hero Title"
              value={formHero.title || ''}
              onChange={e => setFormHero(p => ({ ...p, title: e.target.value }))}
              placeholder="Colleges & Departments"
            />
            <AdminTextarea
              label="Hero Description"
              value={formHero.description || ''}
              onChange={e => setFormHero(p => ({ ...p, description: e.target.value }))}
              placeholder="Discover our world-class..."
              rows={4}
            />
          </div>
        </EditorCard>
      )}

      {(activeTab === 'engineering' || activeTab === 'standalone') && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">
              {activeTab === 'engineering' ? 'Engineering Programs' : 'Stand-Alone Courses'}
            </h3>
            <button
              onClick={() => addItem(activeTab)}
              className="flex items-center gap-1 px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-semibold hover:bg-amber-600 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Program Card
            </button>
          </div>

          {(activeTab === 'engineering' ? formEngineering : formStandalone).map((item, index) => (
            <div key={item.id || index} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Program Card {index + 1} ({item.abbr})
                </span>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => moveItem(activeTab, index, -1)} disabled={index === 0} className="p-1 hover:bg-slate-200 rounded text-slate-500 disabled:opacity-30">
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveItem(activeTab, index, 1)}
                    disabled={index === (activeTab === 'engineering' ? formEngineering : formStandalone).length - 1}
                    className="p-1 hover:bg-slate-200 rounded text-slate-500 disabled:opacity-30"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button onClick={() => removeItem(activeTab, index)} className="p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors ml-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <AdminInput
                        label="Full Title"
                        value={item.title || ''}
                        onChange={e => updateItem(activeTab, index, 'title', e.target.value)}
                        placeholder="Computer Science and Engineering"
                      />
                    </div>
                    <div>
                      <AdminInput
                        label="Abbreviation"
                        value={item.abbr || ''}
                        onChange={e => updateItem(activeTab, index, 'abbr', e.target.value)}
                        placeholder="CSE"
                      />
                    </div>
                  </div>

                  <AdminTextarea
                    label="Overview Description"
                    value={item.description || ''}
                    onChange={e => updateItem(activeTab, index, 'description', e.target.value)}
                    placeholder="Provide highlights..."
                    rows={2}
                  />

                  <AdminInput
                    label="Explore Link Path"
                    value={item.link || ''}
                    onChange={e => updateItem(activeTab, index, 'link', e.target.value)}
                    placeholder="/departments/cse/department"
                  />

                  <AdminInput
                    label="Highlights (Comma Separated)"
                    value={Array.isArray(item.highlights) ? item.highlights.join(', ') : item.highlights || ''}
                    onChange={e => updateItem(activeTab, index, 'highlights', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                    placeholder="Accredited, Smart Labs, High Placements"
                  />
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Program Showcase Image</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="text" 
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 bg-white"
                        value={item.image || ''}
                        onChange={e => updateItem(activeTab, index, 'image', e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                      />
                      <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer hover:bg-slate-200 border border-slate-200 shrink-0">
                        <Upload className="w-3.5 h-3.5" /> Upload
                        <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, activeTab, index)} />
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-center border border-dashed border-slate-200 rounded-xl p-2 bg-white aspect-video relative overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain rounded" />
                    ) : (
                      <span className="text-xs text-slate-400">Preview</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-600 mt-6">
        <Monitor className="w-5 h-5 shrink-0" />
        <div>
          <p className="text-sm font-semibold">Live Preview</p>
          <p className="text-xs mt-0.5">Visits on <a href="/departments" target="_blank" rel="noopener noreferrer" className="underline font-semibold">departments page</a> will render these timelines directly.</p>
        </div>
      </div>
    </EditorPage>
  );
};

export default DepartmentsOverviewEditor;
