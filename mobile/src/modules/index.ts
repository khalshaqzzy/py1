import module1 from './1_Percabangan';
import module2 from './2_Perulangan';
import module3 from './3_FungsiDanProsedur';

export const allModules = [module1, module2, module3];

export const getModule = (moduleId: string) => {
  return allModules.find(m => m.id === moduleId);
};

export const getSection = (moduleId: string, sectionId: string) => {
  const module = getModule(moduleId);
  return module?.sections.find(s => s.id === sectionId);
};
