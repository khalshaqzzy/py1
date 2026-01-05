import Section1 from './Section1';
import Section2 from './Section2';
import Section3 from './Section3';
import Section4 from './Section4';

const module3 = {
  id: '3',
  title: 'Fungsi dan Prosedur',
  description: 'Membangun blok kode yang reusable untuk memecah masalah kompleks.',
  sections: [
    { id: '1', title: "DRY Principle", component: Section1 },
    { id: '2', title: "Definisi Fungsi", component: Section2 },
    { id: '3', title: "Param & Argumen", component: Section3 },
    { id: '4', title: "Variable Scope", component: Section4 },
  ],
};

export default module3;