import React, { createContext, useState, useContext } from 'react';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
    const [currentProject, setCurrentProject] = useState(null);

    const selectProject = (project) => {
        console.log(`📂 Selected project: ${project?.title}`);
        setCurrentProject(project);
    };

    const clearProject = () => {
        console.log('📂 Cleared project selection');
        setCurrentProject(null);
    };

    return (
        <ProjectContext.Provider value={{
            currentProject,
            selectProject,
            clearProject
        }}>
            {children}
        </ProjectContext.Provider>
    );
};

export const useProject = () => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error('useProject must be used within ProjectProvider');
    }
    return context;
};

export default ProjectContext;
