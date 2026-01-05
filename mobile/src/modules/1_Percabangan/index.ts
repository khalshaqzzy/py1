import Section1 from './Section1';
import Section2 from './Section2';
import Section3 from './Section3';
import Section4 from './Section4';
import Section5 from './Section5';

const module1 = {
  id: '1',
  title: 'Percabangan',
  description: 'Mempelajari cara membuat program mengambil keputusan menggunakan struktur if, elif, dan else.',
  sections: [
    { id: '1', title: 'Pengantar Logika', component: Section1 },
    { id: '2', title: 'Operator Perbandingan', component: Section2 },
    { id: '3', title: 'Struktur Dasar', component: Section3 },
    { id: '4', title: 'Operator Logika', component: Section4 },
    { id: '5', title: 'Percabangan Bersarang', component: Section5 },
  ],
};

export default module1;