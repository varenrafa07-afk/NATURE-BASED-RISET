import { useState } from 'react';
import Navbar, { type PageId } from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Projects from './components/Projects';
import UploadProject from './components/UploadProject';
import EditProject from './components/EditProject';
import ProjectDetail from './components/ProjectDetail';
import Gallery from './components/Gallery';
import Videos from './components/Videos';
import Recap from './components/Recap';
import About from './components/About';

type View = PageId | 'detail' | 'edit';

function App() {
  const [view, setView] = useState<View>('home');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const handleNavigate = (page: PageId) => {
    setView(page);
    setSelectedProjectId(null);
  };

  const handleSelectProject = (id: string) => {
    setSelectedProjectId(id);
    setView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setView('projects');
    setSelectedProjectId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditProject = (id: string) => {
    setSelectedProjectId(id);
    setView('edit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToDetail = () => {
    setView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar
        current={view === 'detail' || view === 'edit' ? 'projects' : (view as PageId)}
        onNavigate={handleNavigate}
      />

      <main className="flex-1">
        {view === 'edit' && selectedProjectId ? (
          <EditProject
            projectId={selectedProjectId}
            onNavigate={handleNavigate}
            onDone={handleBackToDetail}
          />
        ) : view === 'detail' && selectedProjectId ? (
          <ProjectDetail
            projectId={selectedProjectId}
            onNavigate={handleNavigate}
            onBack={handleBackToList}
            onEdit={handleEditProject}
          />
        ) : (
          <>
            {view === 'home' && <Home onNavigate={handleNavigate} />}
            {view === 'projects' && (
              <Projects onNavigate={handleNavigate} onSelectProject={handleSelectProject} />
            )}
            {view === 'upload' && <UploadProject onNavigate={handleNavigate} />}
            {view === 'gallery' && <Gallery />}
            {view === 'videos' && <Videos />}
            {view === 'recap' && <Recap />}
            {view === 'about' && <About />}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
