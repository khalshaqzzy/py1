import module1 from './1_Percabangan';

export const allModules = [module1];

export const getModule = (moduleId: string) => {
  return allModules.find(m => m.id === moduleId);
};

export const getSection = (moduleId: string, sectionId: string) => {
  const module = getModule(moduleId);
  return module?.sections.find(s => s.id === sectionId);
};
