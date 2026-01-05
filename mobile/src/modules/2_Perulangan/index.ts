import Section1 from './Section1';
import Section2 from './Section2';
import Section3 from './Section3';
import Section4 from './Section4';

const module2 = {
  id: '2',
  title: 'Perulangan',
  description: 'Menguasai eksekusi kode berulang secara efisien menggunakan loop for dan while.',
  sections: [
    { id: '1', title: 'Konsep Dasar', component: Section1 },
    { id: '2', title: 'For Loop', component: Section2 },
    { id: '3', title: 'While Loop', component: Section3 },
    { id: '4', title: 'Break & Continue', component: Section4 },
  ],
};

export default module2;